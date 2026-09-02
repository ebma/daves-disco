import { spawn, type ChildProcess } from 'node:child_process'
import {
  AudioPlayerStatus, NoSubscriberBehavior, StreamType, VoiceConnectionStatus,
  createAudioPlayer, createAudioResource, entersState, joinVoiceChannel, type VoiceConnection,
} from '@discordjs/voice'
import type { VoiceBasedChannel } from 'discord.js'
import { config } from './config.js'
import { mediaUrl, type Track } from './sources.js'

export class Player {
  queue: Track[] = []
  current?: Track
  volume = 100
  onTrackStart?: (t: Track) => void
  onTrackError?: (t: Track, err: unknown) => void

  private conn?: VoiceConnection
  private audio = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } })
  private ffmpeg?: ChildProcess
  private offsetSec = 0
  private idleTimer?: NodeJS.Timeout
  private aloneTimer?: NodeJS.Timeout

  constructor() {
    this.audio.on(AudioPlayerStatus.Idle, () => void this.next())
    // the player moves to Idle after an error on its own, which advances the queue
    this.audio.on('error', (e) => this.current && this.onTrackError?.(this.current, e))
  }

  get channelId() { return this.conn?.joinConfig.channelId ?? undefined }
  get paused() { return this.audio.state.status === AudioPlayerStatus.Paused }
  get elapsedSec() {
    const s = this.audio.state
    return this.offsetSec + ('resource' in s ? s.resource.playbackDuration / 1000 : 0)
  }

  async join(channel: VoiceBasedChannel) {
    if (this.conn && this.channelId === channel.id) return
    this.conn?.destroy()
    const conn = joinVoiceChannel({
      channelId: channel.id, guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator, selfDeaf: true,
    })
    conn.subscribe(this.audio)
    conn.on(VoiceConnectionStatus.Disconnected, async () => {
      try { // moved channel or brief drop: wait, otherwise give up
        await Promise.race([
          entersState(conn, VoiceConnectionStatus.Signalling, 5_000),
          entersState(conn, VoiceConnectionStatus.Connecting, 5_000),
        ])
      } catch { this.leave() }
    })
    this.conn = conn
    await entersState(conn, VoiceConnectionStatus.Ready, 20_000)
  }

  enqueue(tracks: Track[]) {
    this.queue.push(...tracks)
    if (!this.current) void this.next()
  }

  pause() { this.audio.pause() }
  resume() { this.audio.unpause() }
  skip() { this.audio.stop() }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(200, v))
    const s = this.audio.state
    if ('resource' in s) s.resource.volume?.setVolume(this.volume / 100)
  }

  async seek(sec: number) {
    if (!this.current) throw new Error('nothing is playing')
    if (!this.current.durationSec) throw new Error('cannot seek in a live stream')
    await this.play(this.current, Math.max(0, Math.min(sec, this.current.durationSec - 1)))
  }

  /** Called on voice state changes: leave a minute after the last human is gone. */
  humansPresent(present: boolean) {
    clearTimeout(this.aloneTimer)
    if (!present && this.conn) this.aloneTimer = setTimeout(() => this.leave(), 60_000)
  }

  leave() {
    clearTimeout(this.idleTimer); clearTimeout(this.aloneTimer)
    this.queue = []; this.current = undefined
    this.audio.stop(true)
    this.killFfmpeg()
    this.conn?.destroy(); this.conn = undefined
  }

  private async next() {
    clearTimeout(this.idleTimer)
    const t = this.queue.shift()
    this.current = t
    if (!t) {
      this.idleTimer = setTimeout(() => this.leave(), config.idleMs)
      return
    }
    try { await this.play(t, 0) } catch (e) { this.onTrackError?.(t, e); void this.next() }
  }

  private async play(t: Track, offsetSec: number) {
    const url = await mediaUrl(t) // resolve first, then swap streams in the same tick so no Idle fires in between
    this.killFfmpeg()
    const args = ['-hide_banner', '-loglevel', 'error', '-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5']
    if (offsetSec > 0) args.push('-ss', String(offsetSec))
    args.push('-i', url, '-vn', '-f', 's16le', '-ar', '48000', '-ac', '2', 'pipe:1')
    this.ffmpeg = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'ignore'] })
    const res = createAudioResource(this.ffmpeg.stdout!, { inputType: StreamType.Raw, inlineVolume: true })
    res.volume?.setVolume(this.volume / 100)
    this.offsetSec = offsetSec
    this.audio.play(res)
    if (offsetSec === 0) this.onTrackStart?.(t)
  }

  private killFfmpeg() {
    this.ffmpeg?.kill('SIGKILL')
    this.ffmpeg = undefined
  }
}

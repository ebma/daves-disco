import { Queue } from "typescript-collections"
import { VoiceConnection } from "discord.js"
import { VoiceChannel } from "discord.js"
import _ from "lodash"
import { Message } from "discord.js"
import { TextChannel } from "discord.js"
import { createTrackStream } from "./streams"

export class MusicPlayer {
  cachedMessage: Message
  voiceConnection: VoiceConnection
  private queue: Queue<YoutubeTrack>
  private currentTrack: YoutubeTrack
  private volume: number = 0.2

  constructor() {
    this.queue = new Queue()
  }

  isStreaming() {
    return this.isInVoiceChannel() && !_.isNil(this.voiceConnection.dispatcher)
  }

  getVolume() {
    return this.volume * 100
  }

  setVolume(newVol: number): string {
    if (newVol < 0 || newVol > 100) {
      return "Invalid volume! Choose a number between 0-100%"
    }
    this.volume = newVol / 100
    if (this.isStreaming()) {
      this.voiceConnection.dispatcher.setVolume(this.volume)
    }
  }

  get queuedTracks() {
    return this.queue.size()
  }

  get channel() {
    return _.isNil(this.cachedMessage) ? null : (this.cachedMessage.channel as TextChannel)
  }

  async enqueue(item: YoutubeTrack) {
    this.queue.enqueue(item)
  }

  async clear() {
    this.queue.clear()
  }

  async join(voiceChannel: VoiceChannel) {
    if (voiceChannel.full) {
      throw new Error("Voice channel is full!")
    }
    this.voiceConnection = await voiceChannel.join()
  }

  async play(message: Message) {
    if (this.queue.size() === 0) return "There is nothing in the queue!"
    else if (this.isStreaming()) return "I am already streaming!"
    else if (!this.isInVoiceChannel()) return
    this.cachedMessage = message
    await this.cachedMessage.react("🤘")
    return this.createStream()
  }

  async pauseStream() {
    if (!this.isStreaming()) return "I am not playing anything!"
    else if (this.isPaused()) return "I am already paused!"
    this.voiceConnection.dispatcher.pause()
  }

  async resumeStream() {
    if (!this.isStreaming()) return "There is nothing to resume!"
    else if (!this.isPaused()) return "I have already started playing!"
    this.voiceConnection.dispatcher.resume()
  }

  skipCurrentSong() {
    if (this.isStreaming()) {
      this.voiceConnection.dispatcher.end("skipped")
    }
  }

  async skipNextSongInQueue(){
    if (!this.isStreaming()) {
      if (!this.queue.size()) return false
      this.queue.dequeue()
      return true
    }
  }

  stopStream() {
    if (!this.isInVoiceChannel()) return "I am not connected to a voice channel!"
    else if (this.isStreaming()) this.voiceConnection.dispatcher.end("forceStop")
    this.voiceConnection.disconnect()
    this.voiceConnection = null
  }

  async close(reason: string) {
    await this.cachedMessage.channel.send(reason ? reason : "**Closing music session due to inactivity**")
    this.stopStream()
  }

  private isInVoiceChannel() {
    return !_.isNil(this.voiceConnection)
  }

  private isPaused() {
    return this.isStreaming() && this.voiceConnection.dispatcher.paused
  }

  private createStream() {
    this.currentTrack = this.queue.dequeue()
    createTrackStream(this.currentTrack, stream => {
      this.voiceConnection.playStream(stream, { seek: 0, volume: this.volume, passes: 1 })
      this.voiceConnection.dispatcher.once("start", () =>
        this.cachedMessage.channel.send(`I'm now playing: ${this.currentTrack.title}`)
      )
      this.voiceConnection.dispatcher.once("end", reason => {
        stream.destroy()
        this.cachedMessage.channel.send(`Played: *${this.currentTrack.title}*`)
        if (reason !== "forceStop") {
          if (this.voiceConnection.channel.members.every(member => member.deaf || member.user.bot)) {
            this.cachedMessage.channel.send("Stopping stream since no one is listening")
            this.voiceConnection.disconnect()
          } else if (this.queue.size() > 0) {
            console.log("Creating next stream")
            return setTimeout(() => this.createStream(), 50)
          }
        }
        this.cachedMessage.reply("Music stream ended")
        this.cachedMessage = null
        console.log("Ended music stream")
      })
      this.voiceConnection.dispatcher.on("error", e => {
        console.log(`encountered error`, e)
      })
    })
    return "Music stream started"
  }
}

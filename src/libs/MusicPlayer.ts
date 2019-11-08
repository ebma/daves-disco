import { Queue } from "typescript-collections"
import { VoiceConnection } from "discord.js"
import { VoiceChannel } from "discord.js"
import _ from "lodash"
import { Message } from "discord.js"
import { TextChannel } from "discord.js"
import { setTimeout } from "timers"
import { Track } from "../shared/exported-types"
import { trackError } from "../shared/util/trackError"
import { sendMessage } from "../socket/messageSender"
import { createTrackStream } from "./util/streams"
import ObservableQueue from "./ObservableQueue"

export class MusicPlayer {
  cachedMessage: Message
  currentTrack: Track
  voiceConnection: VoiceConnection
  queue: ObservableQueue<Track>
  private volume: number = 0.1
  private currentDisconnectionTimeout: NodeJS.Timeout

  constructor() {
    this.queue = new ObservableQueue<Track>()

    this.queue.subscribe((currentTrack, remainingTracks) => {
      this.currentTrack = currentTrack
      sendMessage("currentSong", currentTrack)
      sendMessage("currentQueue", remainingTracks)
    })
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
    sendMessage("volume", newVol)
  }

  get queuedTracks() {
    return this.queue.getRemaining()
  }

  get channel() {
    return _.isNil(this.cachedMessage) ? null : (this.cachedMessage.channel as TextChannel)
  }

  async enqueue(item: Track) {
    this.queue.addElement(item)
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
    sendMessage("paused")
  }

  async resumeStream() {
    if (!this.isStreaming()) return "There is nothing to resume!"
    else if (!this.isPaused()) return "I have already started playing!"
    this.voiceConnection.dispatcher.resume()
    sendMessage("resumed")
  }

  shuffle() {
    this.queue.shuffle()
  }

  skipCurrentSong() {
    if (this.isStreaming()) {
      this.queue.moveForward()
      this.voiceConnection.dispatcher.end("skipped")
      return true
    } else {
      return false
    }
  }

  skipPrevious() {
    if (this.isStreaming()) {
      this.queue.moveBack()
      this.voiceConnection.dispatcher.end("skipped")
      return true
    } else {
      return false
    }
  }

  async skipNextSongInQueue() {
    return this.queue.moveForward()
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

  disconnectIfReasonable() {
    if (this.queue && this.queue.size() === 0) {
      this.cachedMessage.channel.send("That's it for now... Later bitches! :metal:")
      this.voiceConnection.disconnect()
      this.voiceConnection = null
    }
  }

  private isInVoiceChannel() {
    return !_.isNil(this.voiceConnection)
  }

  private isPaused() {
    return this.isStreaming() && this.voiceConnection.dispatcher.paused
  }

  private createStream() {
    if (!this.currentTrack) return
    createTrackStream(this.currentTrack, stream => {
      this.voiceConnection.playStream(stream, { seek: 0, volume: this.volume, passes: 1 })
      this.voiceConnection.dispatcher.once("start", () => {
        this.cachedMessage.channel.send(
          `:raised_hands: Let me see your hands while I play *${this.currentTrack.title}* :raised_hands: `
        )
      })
      this.voiceConnection.dispatcher.once("end", reason => {
        stream.destroy()
        this.cachedMessage.channel.send(`Played: *${this.currentTrack.title}*`)
        if (reason !== "forceStop") {
          if (this.voiceConnection.channel.members.every(member => member.deaf || member.user.bot)) {
            this.cachedMessage.channel.send("Stopping stream since no one is listening")
            this.voiceConnection.disconnect()
          } else if (this.queue.size() > 0) {
            return setTimeout(() => this.createStream(), 50)
          } else if (this.queue.size() === 0) {
            this.currentTrack = undefined
            if (!this.currentDisconnectionTimeout) {
              this.currentDisconnectionTimeout = setTimeout(this.disconnectIfReasonable, 1000 * 60 * 15)
            }
            this.currentDisconnectionTimeout.refresh()
          }
        }
      })
      this.voiceConnection.dispatcher.on("error", e => {
        trackError(e, this)
        this.cachedMessage.channel.send(`I don't feel so good... (${e})`)
      })
    })
    return "Music stream started"
  }
}

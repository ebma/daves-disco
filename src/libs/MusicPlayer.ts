import { Queue } from "typescript-collections"
import { VoiceConnection } from "discord.js"
import { VoiceChannel } from "discord.js"
import _ from "lodash"
import { Message } from "discord.js"
import { TextChannel } from "discord.js"
import { setTimeout } from "timers"
import { trackError } from "../shared/util/trackError"
import MessageSender from "../socket/MessageSender"
import { createTrackStream } from "./util/streams"
import ObservableQueue from "./ObservableQueue"
import { RichEmbed } from "discord.js"

export class MusicPlayer {
  cachedMessage?: Message
  currentTrack?: Track
  voiceConnection: VoiceConnection
  queue: ObservableQueue<Track>
  private volume: number = 0.1
  private currentDisconnectionTimeout: NodeJS.Timeout

  constructor() {
    this.queue = new ObservableQueue<Track>()

    this.queue.subscribe((currentTrack, remainingTracks) => {
      this.currentTrack = currentTrack
      if (this.isStreaming() === false && !this.isPaused()) {
        this.createStream()
      }
      MessageSender.sendMessage("currentSong", currentTrack)
      MessageSender.sendMessage("currentQueue", remainingTracks)
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
    MessageSender.sendMessage("volume", newVol)
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

  async setMessage(message: Message) {
    this.cachedMessage = message
    this.cachedMessage.react("🤘")
  }

  async pauseStream() {
    if (!this.isStreaming()) return "I am not playing anything!"
    else if (this.isPaused()) return "I am already paused!"
    this.voiceConnection.dispatcher.pause()
    MessageSender.sendMessage("paused")
  }

  async resumeStream() {
    if (!this.isStreaming()) return "There is nothing to resume!"
    else if (!this.isPaused()) return "I have already started playing!"
    this.voiceConnection.dispatcher.resume()
    MessageSender.sendMessage("resumed")
  }

  shuffle() {
    this.queue.shuffle()
  }

  skipCurrentSong() {
    this.queue.moveForward()
    if (this.isStreaming()) {
      this.voiceConnection.dispatcher.end("skipped")
      return true
    } else {
      return false
    }
  }

  skipPrevious() {
    this.queue.moveBack()
    if (this.isStreaming()) {
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
    this.trySendMessageToChannel(reason ? reason : "**Closing music session due to inactivity**")
    this.stopStream()
  }

  disconnectIfReasonable() {
    if (this.queue && this.queue.size() === 0) {
      this.trySendMessageToChannel("That's it for now... Later bitches! :metal:")
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
      const playingTrack = this.currentTrack
      this.voiceConnection.playStream(stream, { seek: 0, volume: this.volume, passes: 1 })
      this.voiceConnection.dispatcher.once("start", () => {
        this.trySendMessageToChannel(
          `:raised_hands: Let me see your hands while I play *${playingTrack.title}* :raised_hands: `
        )
      })
      this.voiceConnection.dispatcher.once("end", reason => {
        stream.destroy()
        this.trySendMessageToChannel(`Played: *${playingTrack.title}*`)
        if (reason !== "forceStop") {
          if (this.voiceConnection.channel.members.every(member => member.deaf || member.user.bot)) {
            this.trySendMessageToChannel("Stopping stream since no one is listening")
            this.voiceConnection.disconnect()
          } else if (this.queue.getRemaining().length > 0) {
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
        this.trySendMessageToChannel(`I don't feel so good... (${e})`)
      })
    })
    return "Music stream started"
  }

  public trySendMessageToChannel(message: string | RichEmbed, fallbackChannel?: TextChannel) {
    if (this.cachedMessage) {
      this.cachedMessage.channel.send(message)
    } else if (fallbackChannel) {
      fallbackChannel.send(message)
    }
  }
}

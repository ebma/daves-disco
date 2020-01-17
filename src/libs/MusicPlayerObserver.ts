import { Subscription } from "rxjs"
import MusicPlayer from "./MusicPlayer"
import MessageSender from "../socket/MessageSender"
const DEFAULT_TIMEOUT_TIME = 1000 * 60 * 30 // 30 minutes

class MusicPlayerObserver {
  private destructionTimeout: NodeJS.Timeout
  private guildID: GuildID
  private musicPlayer: MusicPlayer
  private subscription: Subscription

  constructor(musicPlayer: MusicPlayer, guildID: GuildID) {
    this.musicPlayer = musicPlayer
    this.guildID = guildID
  }

  startObserving() {
    this.subscription = this.musicPlayer.subscribe({
      // use bind(this) to bind the context to the observer and not the subscription
      next: this.handleMessages.bind(this)
    })
  }

  destroy() {
    this.subscription.unsubscribe()
  }

  private setupDestructionTimeout() {
    if (!this.destructionTimeout) {
      const destructionTimeout = setTimeout(() => {
        if (!this.musicPlayer.destroyed) {
          this.musicPlayer.destroy()
        }
      }, DEFAULT_TIMEOUT_TIME)
      this.destructionTimeout = destructionTimeout
    }
    this.destructionTimeout.refresh()
  }

  private clearDestructionTimeout() {
    if (this.destructionTimeout) {
      clearTimeout(this.destructionTimeout)
    }
  }

  private handleMessages(message: MusicPlayerSubjectMessage) {
    if (message.messageType === "status") {
      switch (message.message) {
        case "idle":
          this.setupDestructionTimeout()
          break
        case "playing":
          this.clearDestructionTimeout()
          break
        case "currentSong":
          const currentTrack = message.data
          MessageSender.sendMessage("currentSong", currentTrack)
          break
        case "currentQueue":
          const remainingTracks = message.data
          MessageSender.sendMessage("currentQueue", remainingTracks)
          break
        case "paused":
          MessageSender.sendMessage("paused")
          break
        case "resumed":
          MessageSender.sendMessage("resumed")
          break
        case "volume":
          const newVolume = message.data
          MessageSender.sendMessage("volume", newVolume)
          break
      }
    } else if (message.messageType === "error") {
      MessageSender.sendMessage("error", message.data)
    }
  }
}

export default MusicPlayerObserver

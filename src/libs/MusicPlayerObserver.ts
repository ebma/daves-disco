import { Subscription } from "rxjs"
import MusicPlayer from "./MusicPlayer"
import WebSocketHandler from "../socket/WebSocketHandler"
import { Messages } from "../shared/ipc"

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
        case "current-track":
          const currentTrack = message.data
          WebSocketHandler.sendMessage(Messages.CurrentTrack, this.guildID, currentTrack)
          break
        case "current-queue":
          const remainingTracks = message.data
          WebSocketHandler.sendMessage(Messages.CurrentQueue, this.guildID, remainingTracks)
          break
        case "paused":
          WebSocketHandler.sendMessage(Messages.PauseChange, this.guildID, true)
          this.setupDestructionTimeout()
          break
        case "resumed":
          WebSocketHandler.sendMessage(Messages.PauseChange, this.guildID, false)
          this.clearDestructionTimeout()
          break
        case "volume":
          const newVolume = message.data
          WebSocketHandler.sendMessage(Messages.VolumeChange, this.guildID, newVolume)
          break
      }
    } else if (message.messageType === "error") {
      WebSocketHandler.sendMessage(Messages.Error, this.guildID, message.data)
    }
  }
}

export default MusicPlayerObserver

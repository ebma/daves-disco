import { Subscription } from "rxjs"
import MusicPlayer from "./MusicPlayer"
import WebSocketHandler from "../socket/WebSocketHandler"
import { Messages } from "../shared/ipc"
import ActivityManager from "./ActivityManager"
import Track from "../db/models/track"

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
          ActivityManager.setIdle()
          this.setupDestructionTimeout()
          break
        case "playing":
          this.clearDestructionTimeout()
          break
        case "current-track":
          if (this.musicPlayer.currentTrack) {
            Track.findById(this.musicPlayer.currentTrack).then(trackModel => {
              if (trackModel) ActivityManager.setPlaying(trackModel.title, trackModel.url)
            })
          }
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          break
        case "current-queue":
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          break
        case "paused":
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          this.setupDestructionTimeout()
          break
        case "resumed":
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          this.clearDestructionTimeout()
          break
        case "volume":
          const newVolume = message.data
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          break
        case "loop-state-changed":
          WebSocketHandler.sendMessage(Messages.PlayerChange)
          break
      }
    } else if (message.messageType === "error") {
      WebSocketHandler.sendMessage(Messages.Error, message.data)
    }
  }
}

export default MusicPlayerObserver

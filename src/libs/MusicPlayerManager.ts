import MusicPlayer from "./MusicPlayer"
import StreamManager from "./StreamManager"

const DEFAULT_TIMEOUT_TIME = 1000 * 60 * 30 // 30 minutes

class MusicPlayerManager {
  private musicPlayerMap: { [key: string]: MusicPlayer } = {}
  private musicPlayerTimeoutMap: { [key: string]: NodeJS.Timeout } = {}

  private handleStatusMessages(message: MusicPlayerSubjectMessage, guildID: string) {
    if (message.messageType === "status" && message.message === "idle") {
      let currentTimeout = this.musicPlayerTimeoutMap[guildID]
      if (!currentTimeout) {
        currentTimeout = setTimeout(() => {
          const musicPlayer = this.musicPlayerMap[guildID]
          if (musicPlayer && !musicPlayer.destroyed) {
            musicPlayer.destroy()
          }
        }, DEFAULT_TIMEOUT_TIME)
      }

      currentTimeout.refresh()
    } else if (message.messageType === "status" && message.message === "playing") {
      const currentTimeout = this.musicPlayerTimeoutMap[guildID]
      if (currentTimeout) {
        clearTimeout(currentTimeout)
      }
    }
  }

  async createPlayerFor(guildID: string, channel: Channel): Promise<MusicPlayer> {
    if (this.musicPlayerMap[guildID] !== undefined && !this.musicPlayerMap[guildID].destroyed) {
      throw new Error(`Player already exists for guild ${guildID}`)
    }

    const connection = await channel.join()
    const musicPlayer = new MusicPlayer(new StreamManager(connection))
    musicPlayer.subscribe({ next: message => this.handleStatusMessages(message, guildID) })
    this.musicPlayerMap[guildID] = musicPlayer
    return musicPlayer
  }

  getPlayerFor(guildID: string): MusicPlayer {
    let savedMusicPlayer = this.musicPlayerMap[guildID]
    if (savedMusicPlayer && savedMusicPlayer.destroyed) {
      this.musicPlayerMap[guildID] = undefined
      savedMusicPlayer = undefined
    }
    return savedMusicPlayer
  }

  removePlayerFor(guildID: string) {
    this.musicPlayerMap[guildID] = undefined
  }
}

export default new MusicPlayerManager()

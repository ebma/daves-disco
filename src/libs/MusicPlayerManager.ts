import MusicPlayer from "./MusicPlayer"
import StreamManager from "./StreamManager"

class MusicPlayerManager {
  private musicPlayerMap: { [key: string]: MusicPlayer } = {}

  async createPlayerFor(guildID: string, channel: Channel) {
    if (this.musicPlayerMap[guildID] !== undefined) {
      throw new Error(`Player already exists for guild ${guildID}`)
    }

    const connection = await channel.join()
    const musicPlayer = new MusicPlayer(new StreamManager(connection))
    this.musicPlayerMap[guildID] = musicPlayer
    return musicPlayer
  }

  getPlayerFor(guildID: string): MusicPlayer {
    const savedMusicPlayer = this.musicPlayerMap[guildID]
    return savedMusicPlayer
  }

  removePlayerFor(guildID: string) {
    this.musicPlayerMap[guildID] = undefined
  }
}

export default new MusicPlayerManager()

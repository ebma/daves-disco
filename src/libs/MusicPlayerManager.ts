import MusicPlayer from "./MusicPlayer"

class MusicPlayerManager {
  private musicPlayerMap: { [key: string]: MusicPlayer } = {}

  createPlayerFor(guildID: string, channel: Channel) {
    if (this.musicPlayerMap[guildID] !== undefined) {
      throw new Error(`Player already exists for guild ${guildID}`)
    }

    const musicPlayer = new MusicPlayer(channel)
    this.musicPlayerMap[guildID] = musicPlayer
    return musicPlayer
  }

  getPlayerFor(guildID: string): MusicPlayer {
    const savedMusicPlayer = this.musicPlayerMap[guildID]
    return savedMusicPlayer
  }

  removePlayerFor(guildID: string) {
    this.musicPlayerMap[guildID] = null
  }
}

export default new MusicPlayerManager()

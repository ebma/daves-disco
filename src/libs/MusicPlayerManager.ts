import { MusicPlayer } from "./MusicPlayer"

class MusicPlayerManager {
  private musicPlayerMap: { [key: string]: MusicPlayer } = {}

  getPlayerFor(guildID: string): MusicPlayer {
    const savedMusicPlayer = this.musicPlayerMap[guildID]
    if (!savedMusicPlayer) {
      const newMusicPlayer = new MusicPlayer()
      this.musicPlayerMap[guildID] = newMusicPlayer
      return newMusicPlayer
    } else {
      return savedMusicPlayer
    }
  }
}

export default new MusicPlayerManager()

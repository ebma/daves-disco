import { trackError } from "../shared/util/trackError"
import { Messages } from "../shared/ipc"
import MessageSender from "../socket/MessageSender"
import MusicPlayer from "./MusicPlayer"
import MusicPlayerObserver from "./MusicPlayerObserver"
import StreamManager from "./StreamManager"

class MusicPlayerManager {
  private musicPlayerMap: { [key in GuildID]: MusicPlayer } = {}
  private musicPlayerObserverMap: { [key in GuildID]: MusicPlayerObserver } = {}

  constructor() {
    MessageSender.addHandler(Messages.GetTrack, guildID => {
      const player = this.musicPlayerMap[guildID]
      if (player) {
        return player.currentTrack
      } else {
        throw Error("Player not available")
      }
    })

    MessageSender.addHandler(Messages.GetQueue, guildID => {
      const player = this.musicPlayerMap[guildID]
      if (player) {
        return player.queue.getAll()
      } else {
        throw Error("Player not available")
      }
    })

    MessageSender.addHandler(Messages.GetVolume, guildID => {
      const player = this.musicPlayerMap[guildID]
      if (player) {
        return player.volume
      } else {
        throw Error("Player not available")
      }
    })

    MessageSender.addHandler(Messages.GetPausedState, guildID => {
      const player = this.musicPlayerMap[guildID]
      if (player) {
        return player.paused
      } else {
        throw Error("Player not available")
      }
    })

    MessageSender.addHandler(Messages.UpdateQueue, (guildID, newItems) => {
      const player = this.musicPlayerMap[guildID]
      if (player) {
        player.updateQueue(newItems)
      } else {
        throw Error("Player not available")
      }
    })
  }

  async createPlayerFor(guildID: GuildID, channel: Channel): Promise<MusicPlayer> {
    if (this.musicPlayerMap[guildID] !== undefined && !this.musicPlayerMap[guildID].destroyed) {
      throw new Error(`Player already exists for guild ${guildID}`)
    }

    const connection = await channel.join()
    const musicPlayer = new MusicPlayer(new StreamManager(connection))
    this.musicPlayerMap[guildID] = musicPlayer

    const musicPlayerObserver = new MusicPlayerObserver(musicPlayer, guildID)
    musicPlayerObserver.startObserving()
    this.musicPlayerObserverMap[guildID] = musicPlayerObserver

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
    try {
      this.musicPlayerObserverMap[guildID].destroy()
      this.musicPlayerObserverMap[guildID] = undefined
      this.musicPlayerMap[guildID].destroy()
      this.musicPlayerMap[guildID] = undefined
    } catch (error) {
      trackError(`Encountered error ${error} while removing player`, "MusicPlayerManager.removePlayerFor")
    }
  }
}

export default new MusicPlayerManager()

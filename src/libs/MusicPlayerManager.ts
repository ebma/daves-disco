import { VoiceBasedChannel } from "discord.js"
import { trackError } from "../utils/trackError"
import MusicPlayer from "./MusicPlayer"
import MusicPlayerObserver from "./MusicPlayerObserver"
import StreamManager from "./StreamManager"
import { joinVoiceChannel } from "@discordjs/voice"

export class MusicPlayerManager {
  private musicPlayerMap: { [key in GuildID]: MusicPlayer } = {}
  private musicPlayerObserverMap: { [key in GuildID]: MusicPlayerObserver } = {}

  async createPlayerFor(guildID: GuildID, channel: VoiceBasedChannel): Promise<MusicPlayer> {
    if (this.musicPlayerMap[guildID] !== undefined && !this.musicPlayerMap[guildID].destroyed) {
      throw new Error(`Player already exists for guild ${guildID}`)
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    })
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

import { WebSocketHandler } from "../WebSocketHandler"
import { Messages } from "../../shared/ipc"
import { MyClient } from "../../bot/MyClient"
import { handlePlay, playTrack, playPlaylist } from "../../bot/commands/music/play"
import { MusicPlayerManager } from "../../libs/MusicPlayerManager"

function requirePlayer(guildID: string, musicPlayerManager: MusicPlayerManager) {
  const player = musicPlayerManager.getPlayerFor(guildID)
  if (!player) {
    throw Error("Player not available!")
  } else {
    return player
  }
}

const createPlayRequestHandler = (musicPlayerManager: MusicPlayerManager, client: MyClient) =>
  async function handlePlayRequest(guildID: string, userID: string, query: string) {
    let player = musicPlayerManager.getPlayerFor(guildID)
    if (!player) {
      const userGuild = client.guilds.cache.find(guild => guild.id === guildID)
      const user = userGuild.members.cache.find(member => member.id === userID)
      const channel = user?.voice.channel
      if (channel) {
        player = await musicPlayerManager.createPlayerFor(guildID, channel)
      } else {
        throw Error("User is not connected to voice channel!")
      }
    }
    await handlePlay(query, guildID, player)
  }

const createPlayTrackRequestHandler = (musicPlayerManager: MusicPlayerManager, client: MyClient) =>
  async function handlePlayTrackRequest(guildID: string, userID: string, track: Track) {
    let player = musicPlayerManager.getPlayerFor(guildID)
    if (!player) {
      const userGuild = client.guilds.cache.find(guild => guild.id === guildID)
      const user = userGuild.members.cache.find(member => member.id === userID)
      const channel = user?.voice.channel
      if (channel) {
        player = await musicPlayerManager.createPlayerFor(guildID, channel)
      } else {
        throw Error("User is not connected to voice channel!")
      }
    }
    await playTrack(track, guildID, player)
  }

const createPlayPlaylistRequestHandler = (musicPlayerManager: MusicPlayerManager, client: MyClient) =>
  async function handlePlayPlaylistRequest(guildID: string, userID: string, playlist: Playlist) {
    let player = musicPlayerManager.getPlayerFor(guildID)
    if (!player) {
      const userGuild = client.guilds.cache.find(guild => guild.id === guildID)
      const user = userGuild.members.cache.find(member => member.id === userID)
      const channel = user?.voice.channel
      if (channel) {
        player = await musicPlayerManager.createPlayerFor(guildID, channel)
      } else {
        throw Error("User is not connected to voice channel!")
      }
    }
    await playPlaylist(playlist, guildID, player)
  }

const createPauseRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handlePauseRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.pauseStream()
  }

const createResumeRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handlePauseRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.resumeStream()
  }

const createSkipRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleSkipRequest(guildID: string, amount: number) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.skipForward(amount)
  }

const createSkipPreviousRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleSkipPreviousRequest(guildID: string, amount: number) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.skipPrevious(amount)
  }

const createStopRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleStopRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.destroy()
  }

const createClearRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleClearRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.clear()
  }

const createShuffleRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleShuffleRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.shuffle()
  }

const createVolumeRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleVolumeRequest(guildID: string, volume: number) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.setVolume(volume)
  }

const createGetPlayerAvailableRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleGetPlayerAvailableRequest(guildID: string) {
    const player = musicPlayerManager.getPlayerFor(guildID)
    return Boolean(player)
  }

const createGetTrackRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleGetTrackRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.currentTrack
  }

const createGetQueueRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleGetQueueRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.queue.getAll()
  }

const createGetVolumeRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleGetVolumeRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.volume
  }

const createGetPausedStateRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleGetPausedStateRequest(guildID: string) {
    const player = requirePlayer(guildID, musicPlayerManager)
    return player.paused
  }

const createUpdateQueueRequestHandler = (musicPlayerManager: MusicPlayerManager) =>
  function handleUpdateQueueRequest(guildID: string, newItems: Track[]) {
    const player = requirePlayer(guildID, musicPlayerManager)
    player.updateQueue(newItems)
  }

export function initPlayerHandlers(
  client: MyClient,
  handler: WebSocketHandler,
  musicPlayerManager: MusicPlayerManager
) {
  handler.addHandler(Messages.Play, createPlayRequestHandler(musicPlayerManager, client))
  handler.addHandler(Messages.PlayTrack, createPlayTrackRequestHandler(musicPlayerManager, client))
  handler.addHandler(Messages.PlayPlaylist, createPlayPlaylistRequestHandler(musicPlayerManager, client))
  handler.addHandler(Messages.Pause, createPauseRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Resume, createResumeRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Skip, createSkipRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.SkipPrevious, createSkipPreviousRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Stop, createStopRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Clear, createClearRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Shuffle, createShuffleRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.Volume, createVolumeRequestHandler(musicPlayerManager))

  handler.addHandler(Messages.GetPlayerAvailable, createGetPlayerAvailableRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.GetTrack, createGetTrackRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.GetQueue, createGetQueueRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.GetVolume, createGetVolumeRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.GetPausedState, createGetPausedStateRequestHandler(musicPlayerManager))
  handler.addHandler(Messages.UpdateQueue, createUpdateQueueRequestHandler(musicPlayerManager))
}

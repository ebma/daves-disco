import Playlist from "./playlist"
import Track from "./track"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"
import Spotify from "../../libs/Spotify"
import Youtube from "../../libs/Youtube"

export async function createTrackModels(tracks: Track[], guildID: GuildID) {
  const trackModels = await Promise.all(
    tracks.map(async track => {
      let trackModel = null
      if (track.id) {
        trackModel = await Track.findOne({ id: track.id, guild: guildID })
      } else {
        trackModel = await Track.findOne({ title: track.title, guild: guildID })
      }
      if (!trackModel) {
        trackModel = new Track({ guild: guildID, touchedByUser: false, ...track })
        await trackModel.save()
        WebSocketHandler.sendMessage(Messages.TracksChange, guildID)
      }
      return trackModel
    })
  )

  return trackModels
}

export async function repopulatePlaylistTracks(playlistModel: PlaylistModel): Promise<TrackModel[]> {
  const populatedPlaylist =
    playlistModel.source === "spotify"
      ? await Spotify.getSpotifyPlaylist(playlistModel.id)
      : await Youtube.createPlaylistFrom(playlistModel.id)

  const populatedTracks = await Promise.all(
    populatedPlaylist.tracks.map(async track => {
      const savedTrack = await Track.findOne({ id: track.id })
      return savedTrack || track
    })
  )

  const populatedTrackModels = await createTrackModels(populatedTracks, playlistModel.guild)

  // remove duplicates
  const populatedTrackModelsDedup = populatedTrackModels.filter((elem, pos, array) => {
    return array.findIndex(e => e.id === elem.id) == pos
  })

  return populatedTrackModelsDedup
}

export async function createAndSavePlaylistModel(playlist: Playlist, guildID: GuildID) {
  let playlistModel = await Playlist.findOne({ guild: guildID, name: playlist.name })
  if (!playlistModel) {
    playlistModel = new Playlist({ guild: guildID, ...playlist })
  }
  playlistModel.lastTouchedAt = Date.now().toString()

  const trackModels = await createTrackModels(playlist.tracks, guildID)

  playlistModel.tracks = []
  for (const trackModel of trackModels) {
    playlistModel.tracks.push(trackModel)
  }

  return Playlist.findOneAndUpdate({ name: playlist.name, guild: guildID }, playlistModel, { upsert: true }).then(
    updatedPlaylist => {
      WebSocketHandler.sendMessage(Messages.PlaylistsChange, guildID)
      if (updatedPlaylist) {
        return updatedPlaylist.populate("tracks")
      } else {
        return playlistModel
      }
    }
  )
}

export async function createAndSaveTrackModel(track: Track, guildID: GuildID) {
  let trackModel = await Track.findOne({ guild: guildID, title: track.title })
  if (!trackModel) {
    trackModel = new Track({ guild: guildID, ...track })
  }
  trackModel.lastTouchedAt = Date.now().toString()
  trackModel.touchedByUser = true

  return Track.findOneAndUpdate({ title: track.title, guild: guildID }, trackModel, { new: true, upsert: true })
    .exec()
    .then(updatedTrack => {
      WebSocketHandler.sendMessage(Messages.TracksChange, guildID)
      return updatedTrack
    })
}

export async function updateTrackModel(updatedModel: TrackModel) {
  return Track.findOneAndUpdate({ title: updatedModel.title, guild: updatedModel.guild }, updatedModel)
}

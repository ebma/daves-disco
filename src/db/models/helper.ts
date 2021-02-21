import Playlist from "./playlist"
import Track from "./track"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"
import Spotify from "../../libs/Spotify"
import Youtube from "../../libs/Youtube"

export async function createTrackModels(tracks: Track[]) {
  const trackModels = await Promise.all(
    tracks.map(async track => {
      let trackModel = await Track.findOne({ title: track.title })
      if (!trackModel) {
        trackModel = new Track({ ...track })
        await trackModel.save()
      }
      return trackModel
    })
  )

  return trackModels
}

export async function repopulatePlaylistTracks(
  playlistModel: PlaylistModel
): Promise<{ name: string; tracks: TrackModel[] }> {
  const populatedPlaylist =
    playlistModel.source === "spotify"
      ? await Spotify.getSpotifyPlaylist(playlistModel.identifier)
      : await Youtube.createPlaylistFrom(playlistModel.identifier)

  const populatedTracks = await Promise.all(
    populatedPlaylist.tracks.map(async track => {
      const savedTrack = await Track.findOne({ title: track.title })
      return savedTrack || track
    })
  )

  const populatedTrackModels = await createTrackModels(populatedTracks)

  // remove duplicates
  const populatedTrackModelsDedup = populatedTrackModels.filter((elem, pos, array) => {
    return array.findIndex(e => e.id === elem.id) == pos
  })

  return { name: populatedPlaylist.name, tracks: populatedTrackModelsDedup }
}

export async function createAndSavePlaylistModel(playlist: Playlist, guildID: GuildID) {
  let playlistModel = await Playlist.findOne({ identifier: playlist.identifier })
  if (!playlistModel) {
    playlistModel = new Playlist({ ...playlist })
  }

  const newLastTouchedItem = { guild: guildID, date: Date.now().toString() }
  const lastTouchedItemIndex = playlistModel.lastTouchedAt.findIndex(value => value.guild === guildID)
  if (lastTouchedItemIndex !== -1) {
    playlistModel.lastTouchedAt[lastTouchedItemIndex] = newLastTouchedItem
  } else {
    playlistModel.lastTouchedAt.push(newLastTouchedItem)
  }

  const defaultFavouriteItem = { guild: guildID, favourite: false }
  const favouriteItemIndex = playlistModel.favourite.findIndex(value => value.guild === guildID)
  if (favouriteItemIndex === -1) {
    playlistModel.favourite.push(defaultFavouriteItem)
  }

  const trackModels = await createTrackModels(playlist.tracks)

  playlistModel.tracks = []
  for (const trackModel of trackModels) {
    playlistModel.tracks.push(trackModel)
  }

  return playlistModel
}

export async function createAndSaveTrackModel(track: Track, guildID: GuildID) {
  let trackModel = await Track.findOne({ title: track.title })
  if (!trackModel) {
    trackModel = new Track({ ...track })
  }
  const newLastTouchedItem = { guild: guildID, date: Date.now().toString() }
  const lastTouchedItemIndex = trackModel.lastTouchedAt.findIndex(value => value.guild === guildID)
  if (lastTouchedItemIndex !== -1) {
    trackModel.lastTouchedAt[lastTouchedItemIndex] = newLastTouchedItem
  } else {
    trackModel.lastTouchedAt.push(newLastTouchedItem)
  }
  const defaultTouchedItem = { guild: guildID, touched: true }
  const touchedItemIndex = trackModel.touchedByUser.findIndex(value => value.guild === guildID)
  if (touchedItemIndex === -1) {
    trackModel.touchedByUser.push(defaultTouchedItem)
  }

  const defaultFavouriteItem = { guild: guildID, favourite: false }
  const favouriteItemIndex = trackModel.favourite.findIndex(value => value.guild === guildID)
  if (favouriteItemIndex === -1) {
    trackModel.favourite.push(defaultFavouriteItem)
  }
  return Track.findOneAndUpdate({ title: track.title }, trackModel, { new: true, upsert: true }).exec()
}

export async function updateTrackModel(updatedModel: TrackModel) {
  return Track.findOneAndUpdate({ title: updatedModel.title }, updatedModel)
}

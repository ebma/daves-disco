import { composeMongoose } from "graphql-compose-mongoose"
import { repopulatePlaylistTracks } from "../../db/models/helper"
import Playlist from "../../db/models/playlist"

const PlaylistTC = composeMongoose(Playlist, {})
PlaylistTC.addResolver({
  name: "playlistRecents",
  args: { guild: "String", limit: "Int" },
  type: PlaylistTC.NonNull.List.NonNull,
  resolve: async (data: any) => {
    const { guild, limit } = data.args
    const query = Playlist.find()
    if (guild) {
      query.where("lastTouchedAt.guild").equals(guild)
    }
    if (limit) {
      query.limit(Number(limit))
    }
    query.sort({ lastTouchedAt: -1 })

    const playlists = await query.exec()
    return playlists.map(playlist => playlist.toJSON())
  }
})
PlaylistTC.addResolver({
  name: "playlistByIdUpdated",
  args: { _id: "MongoID!" },
  type: PlaylistTC,
  resolve: async (data: any) => {
    const { _id } = data.args
    const playlistModel = await Playlist.findById(_id)
    if (playlistModel) {
      const playlistObject = await repopulatePlaylistTracks(playlistModel)
      playlistModel.tracks = playlistObject.tracks
      playlistModel.name = playlistObject.name
      await playlistModel.save()
      const response: any = playlistModel
      response.tracks = playlistObject.tracks.map(track => track._id)
      return response.toJSON()
    } else {
      return null
    }
  }
})

export default PlaylistTC

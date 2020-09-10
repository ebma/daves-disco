import { Request, Router, Response, NextFunction } from "express"
import { repopulatePlaylistTracks } from "../../db/models/helper"
import Playlist from "../../db/models/playlist"
import { Messages } from "../../shared/ipc"
import WebSocketHandler from "../../socket/WebSocketHandler"
import middleware from "../middleware"

const router = Router()

interface PlaylistRequest extends Request {
  body: PlaylistModel
}

router.get("/", middleware.authHandler, async (request: PlaylistRequest, response: Response) => {
  const guild = request.query.guild || null
  const favourite = Boolean(request.query.favourite) || undefined

  const query = Playlist.find()
  if (guild) {
    query.where("lastTouchedAt.guild").equals(guild)
  }
  if (favourite) {
    query.where("favourite.guild").equals(guild)
    query.where("favourite.favourite").equals(favourite)
  }

  query.populate("tracks")

  const playlists = await query.exec()

  response.json(playlists)
})

router.post("/", middleware.authHandler, async (request: PlaylistRequest, response: Response) => {
  const body = request.body

  const playlist = new Playlist({
    id: body.id,
    favourite: body.favourite,
    lastTouchedAt: body.lastTouchedAt,
    name: body.name,
    owner: body.owner,
    source: body.source,
    thumbnail: body.thumbnail,
    uri: body.uri,
    url: body.url
  })

  const savedPlaylist = await playlist.save()

  response.json(savedPlaylist.toJSON())
})

router.get("/:id", middleware.authHandler, async (request: PlaylistRequest, response: Response) => {
  const useCached = request.params.cached
  const playlistModel = await Playlist.findById(request.params.id).populate("tracks")
  if (playlistModel) {
    if (!useCached) {
      const latestTrackModels = await repopulatePlaylistTracks(playlistModel)
      playlistModel.tracks = latestTrackModels

      Playlist.findByIdAndUpdate(request.params.id, playlistModel, { new: true })
        .populate("tracks")
        .then(updatedPlaylist => {
          response.json(updatedPlaylist.toJSON())
          WebSocketHandler.sendMessage(Messages.PlaylistsChange)
        })
    } else {
      response.json(playlistModel.toJSON())
    }
  } else {
    response.status(404).end()
  }
})

router.put("/:id", middleware.authHandler, (request: PlaylistRequest, response: Response, next: NextFunction) => {
  const body = request.body

  const playlist = {
    id: body.id,
    favourite: body.favourite,
    lastTouchedAt: body.lastTouchedAt,
    name: body.name,
    owner: body.owner,
    source: body.source,
    thumbnail: body.thumbnail,
    tracks: body.tracks,
    uri: body.uri,
    url: body.url
  }

  Playlist.findByIdAndUpdate(request.params.id, playlist, { new: true })
    .populate("tracks")
    .then(updatedPlaylist => {
      response.json(updatedPlaylist.toJSON())
      WebSocketHandler.sendMessage(Messages.PlaylistsChange)
    })
    .catch(error => next(error))
})

router.delete("/:id", middleware.authHandler, async (request: PlaylistRequest, response: Response) => {
  await Playlist.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

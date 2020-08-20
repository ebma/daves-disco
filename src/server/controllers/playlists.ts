import { Request, Router } from "express"
import jwt from "jsonwebtoken"
import Playlist from "../../db/models/playlist"
import config from "../../utils/config"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"
import { repopulatePlaylistTracks } from "../../db/models/helper"

const router = Router()

interface PlaylistRequest extends Request {
  body: PlaylistModel
}

const getTokenFrom = (request: Request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

router.get("/", async (request: PlaylistRequest, response) => {
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

router.post("/", async (request: PlaylistRequest, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, config.SECRET) as DecodedToken
  if (!token || !decodedToken.userID) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

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

router.get("/:id", async (request: PlaylistRequest, response) => {
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

router.put("/:id", (request: PlaylistRequest, response, next) => {
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

router.delete("/:id", async (request: PlaylistRequest, response) => {
  await Playlist.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

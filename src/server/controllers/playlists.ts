import { Request, Router } from "express"
import jwt from "jsonwebtoken"
import Playlist, { IPlaylist } from "../../db/models/playlist"
import config from "../../utils/config"
import Spotify from "../../libs/Spotify"
import Youtube from "../../libs/Youtube"

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
  const favourite = Boolean(request.query.favourite) || false
  const query = Playlist.find({ favourite })
  if (guild) {
    query.where("guild").equals(guild)
  }

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
    guild: body.guild,
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
  const playlist = await Playlist.findOne({ id: request.params.id })
  if (playlist) {
    const populatedPlaylist =
      playlist.source === "spotify"
        ? await Spotify.getSpotifyPlaylist(playlist.id)
        : await Youtube.createPlaylistFrom(playlist.id)

    const playlistModel: IPlaylist = { ...playlist.toJSON(), tracks: populatedPlaylist.tracks }

    response.json(playlistModel)
  } else {
    response.status(404).end()
  }
})

router.put("/:id", (request: PlaylistRequest, response, next) => {
  const body = request.body

  const playlist = {
    id: body.id,
    favourite: body.favourite,
    guild: body.guild,
    lastTouchedAt: body.lastTouchedAt,
    name: body.name,
    owner: body.owner,
    source: body.source,
    thumbnail: body.thumbnail,
    uri: body.uri,
    url: body.url
  }

  Playlist.findByIdAndUpdate(request.params.id, playlist, { new: true })
    .then(updatedPlaylist => {
      response.json(updatedPlaylist.toJSON())
    })
    .catch(error => next(error))
})

router.delete("/:id", async (request: PlaylistRequest, response) => {
  await Playlist.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

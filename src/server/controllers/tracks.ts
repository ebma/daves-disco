import { Request, Router } from "express"
import jwt from "jsonwebtoken"
import Track from "../../db/models/track"
import config from "../../utils/config"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"

const router = Router()

interface TrackRequest extends Request {
  body: TrackModel
}

const getTokenFrom = (request: Request) => {
  const authorization = request.get("authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

router.get("/", async (request: TrackRequest, response) => {
  const guild = request.query.guild || undefined
  const favourite = Boolean(request.query.favourite) || false

  const query = Track.find({ favourite })
  if (guild) {
    query.where("guild").equals(guild)
  }

  const tracks = await query.exec()

  response.json(tracks.map(track => track.toJSON()))
})

router.post("/", async (request: TrackRequest, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, config.SECRET) as DecodedToken
  if (!token || !decodedToken.userID) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const track = new Track({
    artists: body.artists,
    id: body.id,
    favourite: body.favourite,
    guild: body.guild,
    lastTouchedAt: body.lastTouchedAt,
    source: body.source,
    title: body.title,
    thumbnail: body.thumbnail,
    url: body.url
  })

  const savedTrack = await track.save()

  response.json(savedTrack.toJSON())
})

router.get("/:id", async (request: TrackRequest, response) => {
  const track = await Track.findById(request.params.id)
  if (track) {
    response.json(track.toJSON())
  } else {
    response.status(404).end()
  }
})

router.put("/:id", (request: TrackRequest, response, next) => {
  const body = request.body

  const track = {
    artists: body.artists,
    id: body.id,
    favourite: body.favourite,
    guild: body.guild,
    lastTouchedAt: body.lastTouchedAt,
    source: body.source,
    title: body.title,
    thumbnail: body.thumbnail,
    url: body.url
  }

  Track.findOneAndUpdate({ id: request.params.id }, track, { new: true })
    .then(updatedTrack => {
      response.json(updatedTrack.toJSON())
      WebSocketHandler.sendMessage(Messages.TracksChange, track.guild)
    })
    .catch(error => next(error))
})

router.delete("/:id", async (request: TrackRequest, response) => {
  await Track.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

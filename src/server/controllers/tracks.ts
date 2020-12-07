import { Request, Router, Response, NextFunction } from "express"
import { mongo } from "mongoose"
import Track from "../../db/models/track"
import { Messages } from "../../shared/ipc"
import WebSocketHandler from "../../socket/WebSocketHandler"
import middleware from "../middleware"

const router = Router()

interface TrackRequest extends Request {
  body: TrackModel
}

router.get("/", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  const guild = request.query.guild || undefined
  const limit = request.query.limit || undefined
  const order = request.query.order || undefined
  const favourite = Boolean(request.query.favourite) || undefined

  const query = Track.find()
  if (guild) {
    query.where("lastTouchedAt.guild").equals(guild)
  }
  if (favourite) {
    query.where("favourite.guild").equals(guild)
    query.where("favourite.favourite").equals(favourite)
  }
  if (limit) {
    query.limit(Number(limit))
  }
  if (order) {
    const sortNumber = order === "desc" ? -1 : 1
    query.sort({ lastTouchedAt: sortNumber })
  }

  const tracks = await query.exec()

  response.json(tracks.map(track => track.toJSON()))
})

router.get("/track/", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  const trackID: string = (request.query.track as string) || undefined
  if (!trackID) {
    response.status(400).end()
  } else {
    const query = Track.find({ _id: new mongo.ObjectId(trackID) })

    const tracks = await query.exec()
    if (tracks.length > 0) {
      response.json(tracks[0].toJSON())
    } else {
      response.status(404).end()
    }
  }
})

router.get("/list/", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  const trackIDs: Array<string> = (request.query.tracks as string[]) || undefined
  if (!trackIDs) {
    response.json([])
  } else {
    const objectIDs = trackIDs.map(trackID => new mongo.ObjectId(trackID))
    const query = Track.find({ _id: { $in: objectIDs } })

    const tracks = await query.exec()

    const orderedTracks = trackIDs
      .map(trackID => tracks.find(track => track._id.toString() === trackID))
      .filter(track => track)

    response.json(orderedTracks.map(track => track.toJSON()))
  }
})

router.post("/", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  const body = request.body

  const track = new Track({
    artists: body.artists,
    favourite: body.favourite,
    lastTouchedAt: body.lastTouchedAt,
    source: body.source,
    title: body.title,
    thumbnail: body.thumbnail,
    url: body.url
  })

  const savedTrack = await track.save()

  response.json(savedTrack.toJSON())
})

router.get("/:id", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  const track = await Track.findById(request.params.id)
  if (track) {
    response.json(track.toJSON())
  } else {
    response.status(404).end()
  }
})

router.put("/:id", middleware.authHandler, (request: TrackRequest, response: Response, next: NextFunction) => {
  const body = request.body

  const track = {
    artists: body.artists,
    favourite: body.favourite,
    lastTouchedAt: body.lastTouchedAt,
    source: body.source,
    title: body.title,
    touchedByUser: body.touchedByUser,
    thumbnail: body.thumbnail,
    url: body.url
  }

  Track.findByIdAndUpdate(request.params.id, track, { upsert: true })
    .then(updatedTrack => {
      response.json(updatedTrack.toJSON())
      WebSocketHandler.sendMessage(Messages.TracksChange)
    })
    .catch(error => next(error))
})

router.delete("/:id", middleware.authHandler, async (request: TrackRequest, response: Response) => {
  await Track.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

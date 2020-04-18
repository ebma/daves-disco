import { Request, Router } from "express"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import Track from "../../db/models/track"

interface QueuePostRequest extends Request {
  body: { queue: TrackModel[] }
}

export function createPlayerRouter(client: MyClient) {
  const playerRouter = Router()

  playerRouter.get("/:id", async (request, response) => {
    const guild = client.guilds.cache.find(guild => guild.id == request.params.id)
    if (guild) {
      const player = MusicPlayerManager.getPlayerFor(guild.id)

      let playerState: PlayerModel
      if (!player) {
        playerState = {
          available: false,
          currentTrack: null,
          paused: false,
          queue: [],
          volume: 50
        }
      } else {
        const currentTrack = await Track.findById(player.currentTrack)
        const queue = await Track.find({ _id: { $in: player.queue.getAll() } })
        // finding many will mix the original order
        const sortedQueue = player.queue
          .getAll()
          .map(trackID => queue.find(track => track.toJSON()._id.toString() === trackID))
          .filter(track => track)

        playerState = {
          available: true,
          currentTrack,
          paused: player.paused,
          queue: sortedQueue,
          volume: player.volume
        }
      }

      response.json(playerState)
    } else {
      response.status(404).end()
    }
  })

  playerRouter.post("/queue/:id", (request: QueuePostRequest, response) => {
    const guild = client.guilds.cache.find(guild => guild.id == request.params.id)

    if (guild) {
      const player = MusicPlayerManager.getPlayerFor(guild.id)
      player.updateQueue(request.body.queue.map(track => track._id))

      const updatedQueue = player.queue.getAll()
      response.json(updatedQueue)
    } else {
      response.status(404).end()
    }
  })

  return playerRouter
}

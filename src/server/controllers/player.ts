import { Request, Router } from "express"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

interface QueuePostRequest extends Request {
  body: { queue: TrackModelID[] }
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
          currentTrackID: null,
          paused: false,
          queueIDs: [],
          volume: 50
        }
      } else {
        playerState = {
          available: true,
          currentTrackID: player.currentTrack,
          paused: player.paused,
          queueIDs: player.queue.getAll(),
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
      player.updateQueue(request.body.queue)

      const updatedQueue = player.queue.getAll()
      response.json(updatedQueue)
    } else {
      response.status(404).end()
    }
  })

  return playerRouter
}

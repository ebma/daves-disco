import { schemaComposer } from "graphql-compose"
import { MyClient } from "../../bot/MyClient"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

export function getPlayerTC(client: MyClient) {
  const QueuedTrackTC = schemaComposer.createObjectTC({
    name: "QueuedTrack",
    fields: { trackModelID: "MongoID!", uuid: "String!" }
  })

  const PlayerTC = schemaComposer.createObjectTC({
    name: "Player",
    fields: {
      available: "Boolean!",
      currentTrackID: "QueuedTrack",
      loopState: "String!",
      paused: "Boolean!",
      queueIDs: "[QueuedTrack!]!",
      volume: "Int!"
    }
  })

  PlayerTC.addNestedFields({})

  PlayerTC.addResolver({
    name: "getPlayer",
    args: { guild: "String!" },
    type: PlayerTC,
    resolve: async (data: any) => {
      const guildID = data.args.guild
      const guild = client.guilds.cache.find(guild => guild.id == guildID)
      if (guild) {
        const player = MusicPlayerManager.getPlayerFor(guild.id)

        let playerState: PlayerModel
        if (!player) {
          playerState = {
            available: false,
            currentTrackID: null,
            loopState: "none",
            paused: false,
            queueIDs: [],
            volume: 50
          }
        } else {
          playerState = {
            available: true,
            currentTrackID: player.currentTrack,
            loopState: player.queue.loopState,
            paused: player.paused,
            queueIDs: player.queue.getAll(),
            volume: Math.round(player.volume)
          }
        }

        return playerState
      } else {
        return null
      }
    }
  })

  PlayerTC.addResolver({
    name: "updateQueue",
    args: { guild: "String!", queueIDs: QueuedTrackTC.getITC().NonNull.List.NonNull },
    type: PlayerTC,
    resolve: async (data: any) => {
      const guildID = data.args.guild
      const queueIDs = data.args.queueIDs

      const guild = client.guilds.cache.find(guild => guild.id == guildID)

      if (guild) {
        const player = MusicPlayerManager.getPlayerFor(guild.id)
        player.updateQueue(queueIDs)

        return {
          available: true,
          currentTrackID: player.currentTrack,
          loopState: player.queue.loopState,
          paused: player.paused,
          queueIDs: player.queue.getAll(),
          volume: player.volume
        }
      } else {
        return null
      }
    }
  })

  return PlayerTC
}

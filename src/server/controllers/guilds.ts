import { Router } from "express"
import { MyClient } from "../../bot/MyClient"

export function createGuildRouter(client: MyClient) {
  const guildRouter = Router()

  guildRouter.get("/", async (request, response) => {
    const guilds: ReducedGuilds = client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }))

    response.json(guilds)
  })

  guildRouter.get("/:id", async (request, response) => {
    const guild = client.guilds.cache.find(guild => guild.id == request.params.id)
    if (guild) {
      const members: ReducedMembers = guild.members.cache.map(member => ({ id: member.id, name: member.displayName }))

      response.json(members)
    } else {
      response.status(404).end()
    }
  })

  return guildRouter
}

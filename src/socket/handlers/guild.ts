import { MyClient } from "../../bot/MyClient"
import { Messages } from "../../shared/ipc"
import { WebSocketHandler } from "../WebSocketHandler"

const createGetGuildRequestHandler = (client: MyClient) =>
  function handleGetGuildRequest() {
    const guilds = client.guilds.cache
    const reducedGuilds = guilds
      .map(g => {
        return { id: g.id, name: g.name }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    return reducedGuilds
  }

const createGetUsersRequestHandler = (client: MyClient) =>
  function handleGetUsersRequest(guildID: GuildID) {
    const guild = client.guilds.cache.find(g => g.id === guildID)
    if (guild) {
      const members = guild.members.cache
      const reducedMembers = members
        .filter(
          member =>
            !member.user.bot && (member.user.presence.status === "online" || member.user.presence.status === "idle")
        )
        .map(member => {
          return { id: member.id, name: member.displayName }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
      return reducedMembers
    } else {
      throw Error(`Could not find guild with ID ${guildID}`)
    }
  }

export function initGuildHandlers(client: MyClient, handler: WebSocketHandler) {
  handler.addHandler(Messages.GetGuilds, createGetGuildRequestHandler(client))
  handler.addHandler(Messages.GetMembers, createGetUsersRequestHandler(client))
}

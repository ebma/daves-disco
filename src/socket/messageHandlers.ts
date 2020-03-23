import { AkairoClient } from "discord-akairo"
import MessageSender from "./MessageSender"
import { Messages } from "../shared/ipc"

const createGetGuildRequestHandler = (client: AkairoClient) =>
  function handleGetGuildRequest() {
    const guilds = client.guilds
    const reducedGuilds = guilds
      .map(g => {
        return { id: g.id, name: g.name }
      })
      .sort((a, b) => a.name.localeCompare(b.name))

    return reducedGuilds
  }

const createGetUsersRequestHandler = (client: AkairoClient) =>
  function handleGetUsersRequest(guildID: GuildID) {
    const guild = client.guilds.find(g => g.id === guildID)
    if (guild) {
      const members = guild.members
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

export function initHandlers(client: AkairoClient) {
  MessageSender.addHandler(Messages.GetGuilds, createGetGuildRequestHandler(client))
  MessageSender.addHandler(Messages.GetMembers, createGetUsersRequestHandler(client))
}

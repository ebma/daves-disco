import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import MusicPlayerManager from "../libs/MusicPlayerManager"
import MessageSender from "./MessageSender"

const handleControlMessages = (socket: Socket, client: AkairoClient) => (message: ControlMessage) => {
  switch (message.type) {
    case "getGuilds":
      const guilds = client.guilds
      const reducedGuilds = guilds
        .map(g => {
          return { id: g.id, name: g.name }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      MessageSender.sendResultResponse(message, reducedGuilds)
      break
    case "getUsers":
      if (!message.guildID) {
        MessageSender.sendErrorResponse(message, "No guildID provided!")
      } else {
        const guild = client.guilds.find(g => g.id === message.guildID)
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
          MessageSender.sendResultResponse(message, reducedMembers)
        } else {
          MessageSender.sendErrorResponse(message, `Could not find guild with ID ${message.guildID}`)
        }
      }
      break
    case "getCurrentSong":
      if (!message.guildID) {
        MessageSender.sendErrorResponse(message, "No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(message.guildID)
        MessageSender.sendResultResponse(message, player.currentTrack)
      }
      break
    case "getCurrentQueue":
      if (!message.guildID) {
        MessageSender.sendErrorResponse(message, "No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(message.guildID)
        MessageSender.sendResultResponse(message, player.queuedTracks)
      }
      break
    case "getVolume":
      if (!message.guildID) {
        MessageSender.sendErrorResponse(message, "No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(message.guildID)
        MessageSender.sendResultResponse(message, player.getVolume())
      }
      break
  }
}

export { handleControlMessages }

import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { ControlMessage } from "../types/exported-types"
import MusicPlayerManager from "../libs/MusicPlayerManager"
import { sendResultResponse, sendErrorResponse } from "./messageSender"

const handleControlMessages = (socket: Socket, client: AkairoClient) => (message: ControlMessage) => {
  switch (message.type) {
    case "getGuilds":
      const guilds = client.guilds
      const reducedGuilds = guilds
        .map(g => {
          return { id: g.id, name: g.name }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      sendResultResponse(message, reducedGuilds)
      break
    case "getUsers":
      if (!message.guildID) {
        sendErrorResponse(message, "No guildID provided!")
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
          sendResultResponse(message, reducedMembers)
        } else {
          sendErrorResponse(message, `Could not find guild with ID ${message.guildID}`)
        }
      }
      break
    case "getCurrentSong":
      if (!message.guildID) {
        sendErrorResponse(message, "No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(message.guildID)
        sendResultResponse(message, player.currentTrack)
      }
      break
    case "getCurrentQueue":
      if (!message.guildID) {
        sendErrorResponse(message, "No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(message.guildID)
        sendResultResponse(message, player.queuedTracks)
      }
      break
  }
}

export { handleControlMessages }

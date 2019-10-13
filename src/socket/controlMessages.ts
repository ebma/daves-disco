import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { ControlMessage, ControlMessageResponse } from "../types/exported-types"
import MusicPlayerManager from "../libs/MusicPlayerManager"

const handleControlMessages = (socket: Socket, client: AkairoClient) => (data: ControlMessage) => {
  const sendControlResult = (result: any) => {
    const response: ControlMessageResponse = { type: data.type, messageID: data.messageID, result }
    socket.emit("event", response)
  }

  const sendControlError = (error: any) => {
    const response: ControlMessageResponse = { type: data.type, messageID: data.messageID, error }
    socket.emit("event", response)
  }

  switch (data.type) {
    case "getGuilds":
      const guilds = client.guilds
      const reducedGuilds = guilds
        .map(g => {
          return { id: g.id, name: g.name }
        })
        .sort((a, b) => a.name.localeCompare(b.name))

      sendControlResult(reducedGuilds)
      break
    case "getUsers":
      if (!data.guildID) {
        sendControlError("No guildID provided!")
      } else {
        const guild = client.guilds.find(g => g.id === data.guildID)
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
          sendControlResult(reducedMembers)
        } else {
          sendControlError(`Could not find guild with ID ${data.guildID}`)
        }
      }
      break
    case "getCurrentSong":
      if (!data.guildID) {
        sendControlError("No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(data.guildID)
        console.log("sending current song", player.currentTrack)
        sendControlResult(player.currentTrack)
      }
      break
    case "getCurrentQueue":
      if (!data.guildID) {
        sendControlError("No guildID provided!")
      } else {
        const player = MusicPlayerManager.getPlayerFor(data.guildID)
        sendControlResult(player.queuedTracks)
      }
      break
  }
}

export { handleControlMessages }

import { AkairoClient } from "discord-akairo"
import { Socket } from "socket.io"
import { trackError } from "../shared/util/trackError"
import MusicPlayerManager from "../libs/MusicPlayerManager"
import MessageSender from "./MessageSender"

type ControlMessageHandler = (message: ControlMessage, client: AkairoClient) => void
type ControlMessageHandlers = {
  [messageType in ControlMessageType]?: ControlMessageHandler
}

let messageHandlers: ControlMessageHandlers = {}

function handleGetGuildRequest(message: ControlMessage, client: AkairoClient) {
  const guilds = client.guilds
  const reducedGuilds = guilds
    .map(g => {
      return { id: g.id, name: g.name }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  MessageSender.sendResultResponse(message, reducedGuilds)
}

function handleGetUsersRequest(message: ControlMessage, client: AkairoClient) {
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
}

function handleGetCurrentSongRequest(message: ControlMessage, client: AkairoClient) {
  if (!message.guildID) {
    MessageSender.sendErrorResponse(message, "No guildID provided!")
    return
  }

  const player = MusicPlayerManager.getPlayerFor(message.guildID)
  if (player) {
    MessageSender.sendResultResponse(message, player.currentTrack)
  } else {
    MessageSender.sendErrorResponse(message, "No player available")
  }
}

function handleGetCurrentQueueRequest(message: ControlMessage, client: AkairoClient) {
  if (!message.guildID) {
    MessageSender.sendErrorResponse(message, "No guildID provided!")
    return
  }

  const player = MusicPlayerManager.getPlayerFor(message.guildID)
  if (player) {
    MessageSender.sendResultResponse(message, player.queuedTracks)
  } else {
    MessageSender.sendErrorResponse(message, "No player available")
  }
}

function handleGetVolumeRequest(message: ControlMessage, client: AkairoClient) {
  if (!message.guildID) {
    MessageSender.sendErrorResponse(message, "No guildID provided!")
    return
  }

  const player = MusicPlayerManager.getPlayerFor(message.guildID)
  if (player) {
    MessageSender.sendResultResponse(message, player.volume)
  } else {
    MessageSender.sendErrorResponse(message, "No player available")
  }
}

function createControlMessageListener(socket: Socket, client: AkairoClient): (message: ControlMessage) => void {
  const listener = (message: ControlMessage) => {
    const handler = messageHandlers[message.type]
    if (handler) {
      handler(message, client)
    } else {
      trackError(`No message handler defined for ${message.type}`)
    }
  }

  messageHandlers["getGuilds"] = handleGetGuildRequest
  messageHandlers["getUsers"] = handleGetUsersRequest
  messageHandlers["getCurrentSong"] = handleGetCurrentSongRequest
  messageHandlers["getCurrentQueue"] = handleGetCurrentQueueRequest
  messageHandlers["getVolume"] = handleGetVolumeRequest

  return listener
}

export { createControlMessageListener }

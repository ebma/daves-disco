import jwt, { VerifyErrors } from "jsonwebtoken"
import { GuildMember } from "discord.js"
import { Messages } from "../shared/ipc"
import { config } from "dotenv"
import moment from "moment"

config()

const secret = process.env.JWT_SECRET

const AuthenticationWhiteList: Array<string> = [
  Messages.Authenticate,
  Messages.IsAuthenticated,
  Messages.GetGuilds,
  Messages.GetMembers
]

let loginTimeouts: Record<UserID, number> = {}

interface DecodedToken {
  guildID: string
  userID: string
}

function getTimeout(user: GuildMember) {
  if (loginTimeouts[user.id]) {
    if (moment.now() < loginTimeouts[user.id]) {
      return moment(loginTimeouts[user.id]).fromNow()
    }
  }
}

export async function initLogin(user: GuildMember) {
  if (getTimeout(user)) {
    throw Error(`Too many login attempts. Try again ${getTimeout(user)}!`)
  } else {
    loginTimeouts[user.id] = moment.now() + 60 * 1000
  }

  const dmChannel = await user.createDM()
  dmChannel.send("Are you currently trying to login with the web interface? (y/n)")

  const filter = (response: any) => {
    return response.content.startsWith("y") || response.content.startsWith("n")
  }

  const collected = await dmChannel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] })
  const answer = collected.first().content
  if (answer.startsWith("y")) {
    try {
      const token = jwt.sign({ guildID: user.guild.id, userID: user.id }, secret, {
        expiresIn: "24h"
      })
      return token
    } catch (error) {
      throw Error(`Something went wrong: ${error?.message}`)
    }
  } else {
    throw Error("User declined authentication request!")
  }
}

export function checkToken(token: string) {
  return new Promise<DecodedToken>((resolve, reject) => {
    if (!token) {
      reject("No token provided!")
    }

    jwt.verify(token, secret, (err: VerifyErrors, decoded: DecodedToken) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

export async function authenticateMessage(message: IPC.SocketMessage) {
  if (AuthenticationWhiteList.includes(message.messageType)) {
    return
  }

  const token = message.token
  if (token) {
    try {
      const decodedToken = await checkToken(token)
    } catch (error) {
      throw Error(`Auth token is invalid! ${error}`)
    }
  } else {
    throw Error("Auth token was not supplied!")
  }
}

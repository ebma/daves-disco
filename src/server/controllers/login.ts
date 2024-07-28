import { Client, GuildMember } from "discord.js"
import { Request, Router } from "express"
import jwt from "jsonwebtoken"
import moment from "moment"
import { MyClient } from "../../bot/MyClient"
import config from "../../utils/config"

interface Timeout {
  until: number
  reason: "login-declined" | "default"
}

// TODO change timeouts to use ip addresses
const loginTimeouts: Record<UserID, Timeout> = {}

function getTimeout(user: GuildMember) {
  return loginTimeouts[user.id]
}

function addTimeout(user: GuildMember, reason: Timeout["reason"]) {
  const until = reason === "login-declined" ? moment.now() + 5 * 60 * 1000 : moment.now() + 60 * 1000
  loginTimeouts[user.id] = { until, reason }
}

async function initLogin(user: GuildMember) {
  if (getTimeout(user) && getTimeout(user).until > Date.now()) {
    const errorMessage =
      getTimeout(user).reason === "login-declined"
        ? `Login was declined by user. Try again ${moment(getTimeout(user).until).fromNow()}!`
        : `Too many login attempts. Try again ${moment(getTimeout(user).until).fromNow()}!`
    throw Error(errorMessage)
  } else {
    // addTimeout(user, "default")
  }

  const dmChannel = await user.createDM()
  dmChannel.send("Are you currently trying to login with the web interface? (y/n)")

  const filter = (response: { content: string }) => {
    return response.content.toLowerCase().startsWith("y") || response.content.toLowerCase().startsWith("n")
  }

  const collected = await dmChannel.awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
  const answer = collected.first().content
  if (answer.toLowerCase().startsWith("y")) {
    try {
      const token = jwt.sign({ guildID: user.guild.id, userID: user.id }, config.SECRET, {
        expiresIn: "60d",
      })
      dmChannel.send("Login successful. You can head back to your browser.")
      return token
    } catch (error) {
      throw Error(`Something went wrong: ${error?.message}`)
    }
  } else {
    dmChannel.send("Login denied. Someone tried to login to the web interface with your user.")
    addTimeout(user, "login-declined")
    throw Error("User declined the authentication request!")
  }
}

interface LoginRequest extends Request {
  body: {
    guildID: GuildID
    userID: UserID
  }
}

export function createLoginRouter(client: Client) {
  const loginRouter = Router()

  loginRouter.post("/", async (request: LoginRequest, response) => {
    const body = request.body

    const guild = client.guilds.cache.find((guild) => guild.id === body.guildID)
    const user = guild.members.cache.find((member) => member.id === body.userID)

    try {
      const token = await initLogin(user)
      response.status(200).send({ token })
    } catch (error) {
      return response.status(401).json({
        error: error.message,
      })
    }
  })

  return loginRouter
}

import { MyClient } from "../../MyClient"
import { Messages } from "../../shared/ipc"
import { WebSocketHandler } from "../WebSocketHandler"
import { checkToken, initLogin } from "../middleware"

const createAuthenticateRequestHandler = (client: MyClient) =>
  function handleAuthenticateRequest(guildID: GuildID, userID: UserID) {
    const guild = client.guilds.cache.find(g => g.id === guildID)
    const user = guild.members.cache.find(member => member.id === userID)
    if (!user) {
      throw Error("User not found!")
    }
    const token = initLogin(user)
    return token
  }

const createIsAuthenticatedRequestHandler = (client: MyClient) =>
  async function handleIsAuthenticatedRequest(guildID: GuildID, userID: UserID, token: string) {
    const guild = client.guilds.cache.find(g => g.id === guildID)
    if (guild) {
      const decodedToken = await checkToken(token)
      if (decodedToken.userID === userID && decodedToken.guildID === guildID) {
        return true
      } else {
        return false
      }
    } else {
      throw Error(`Could not find guild with ID ${guildID}`)
    }
  }

export function initAuthHandlers(client: MyClient, handler: WebSocketHandler) {
  handler.addHandler(Messages.Authenticate, createAuthenticateRequestHandler(client))
  handler.addHandler(Messages.IsAuthenticated, createIsAuthenticatedRequestHandler(client))
}

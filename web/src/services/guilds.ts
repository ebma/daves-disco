import axios from "./axios-client"

const baseUrl = "/api/guilds"

const getGuilds = async (): Promise<ReducedGuilds> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getMembers = async (guildID: GuildID): Promise<ReducedMembers> => {
  const response = await axios.get(`${baseUrl}/${guildID}`)
  return response.data
}

const guildService = {
  getGuilds,
  getMembers
}

export default guildService

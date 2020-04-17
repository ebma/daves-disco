import axios from "./axios-client"

const baseUrl = "/api/player"

const getPlayer = async (guildID: GuildID): Promise<PlayerModel> => {
  const response = await axios.get(`${baseUrl}/${guildID}`)
  return response.data
}

const updateQueue = async (guildID: GuildID, queue: TrackModel[]): Promise<TrackModel[]> => {
  const response = await axios.post(`${baseUrl}/queue/${guildID}`, {
    queue
  })
  return response.data
}

const playerService = {
  getPlayer,
  updateQueue
}

export default playerService

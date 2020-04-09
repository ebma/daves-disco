import axios from "./axios-client"

const baseUrl = "/api/tracks"

const getAll = async (guildID?: GuildID): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID
    }
  })
  return response.data
}

const getFavourites = async (guildID?: GuildID): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID,
      favourite: true
    }
  })
  return response.data
}

const update = async (id: string, newObject: TrackModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const trackService = {
  getAll,
  getFavourites,
  update
}

export default trackService

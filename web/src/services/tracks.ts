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

const update = (id: number, newObject: TrackModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const trackService = {
  getAll,
  getFavourites,
  update
}

export default trackService

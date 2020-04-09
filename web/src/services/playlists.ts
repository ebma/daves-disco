import axios from "./axios-client"

const baseUrl = "/api/playlists/"

const getAll = async (guildID?: GuildID): Promise<PlaylistModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID
    }
  })
  return response.data
}

const getFavourites = async (guildID?: GuildID): Promise<PlaylistModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID,
      favourite: true
    }
  })
  return response.data
}

const get = async (id: string): Promise<PlaylistModel> => {
  const response = await axios.get(baseUrl + id)
  return response.data
}

const update = async (id: string, newObject: PlaylistModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const playlistService = {
  get,
  getAll,
  getFavourites,
  update
}

export default playlistService

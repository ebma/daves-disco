import axios from "./axios-client"

const baseUrl = "/api/playlists/"

const getAll = async (): Promise<PlaylistModel[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getFavourites = async (): Promise<PlaylistModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      favourite: true
    }
  })
  return response.data
}

const get = async (id: string): Promise<PlaylistModel> => {
  const response = await axios.get(baseUrl + id)
  return response.data
}

const update = (id: number, newObject: PlaylistModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const playlistService = {
  get,
  getAll,
  getFavourites,
  update
}

export default playlistService

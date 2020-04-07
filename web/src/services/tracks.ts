import axios from "./axios-client"

const baseUrl = "/api/tracks"

const getAll = async (): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getFavourites = async (): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
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

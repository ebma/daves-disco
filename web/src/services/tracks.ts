import axios from "./axios-client"

const baseUrl = "/api/tracks"

const getAll = async (guildID?: GuildID, limit: number = 20, order: string = "desc"): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID,
      limit,
      order
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

const getList = async (trackIDs: Array<string>): Promise<TrackModel[]> => {
  const response = await axios.get(baseUrl + "/list", {
    params: {
      tracks: trackIDs
    }
  })
  return response.data
}

const getTrack = async (trackID: string): Promise<TrackModel> => {
  const response = await axios.get(baseUrl + "/track", {
    params: {
      track: trackID
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
  getTrack,
  getList,
  update
}

export default trackService

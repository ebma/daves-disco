import axios from "./axios-client"

const baseUrl = "/api/tracks"

function chunkArray(myArray: any[], chunk_size: number) {
  var index = 0
  var arrayLength = myArray.length
  var tempArray = []

  for (index = 0; index < arrayLength; index += chunk_size) {
    const myChunk = myArray.slice(index, index + chunk_size)
    tempArray.push(myChunk)
  }

  return tempArray
}

const getAll = async (guildID?: GuildID, limit: number = 20, order: string = "desc"): Promise<TrackModel[]> => {
  const response = await axios.get<TrackModel[]>(baseUrl, {
    params: {
      guild: guildID,
      limit,
      order
    }
  })
  return response.data
}

const getFavourites = async (guildID?: GuildID): Promise<TrackModel[]> => {
  const response = await axios.get<TrackModel[]>(baseUrl, {
    params: {
      guild: guildID,
      favourite: true
    }
  })
  return response.data
}

const getList = async (trackIDs: Array<string>): Promise<TrackModel[]> => {
  const chunks = chunkArray(trackIDs, 100)
  const promises = chunks.map(trackIDs =>
    axios.get<TrackModel[]>(baseUrl + "/list", {
      params: {
        tracks: trackIDs
      }
    })
  )

  const response = await Promise.all(promises)
  const data = response.reduce<TrackModel[]>((prev, current) => {
    return prev.concat(current.data)
  }, [])
  return data
}

const getTrack = async (trackID: string): Promise<TrackModel> => {
  const response = await axios.get<TrackModel>(baseUrl + "/track", {
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

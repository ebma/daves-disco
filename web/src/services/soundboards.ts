import axios from "./axios-client"

const baseUrl = "/api/soundboards"

const getAll = async (guildID?: GuildID): Promise<SoundboardItemModel[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      guild: guildID
    }
  })
  return response.data
}

const create = async (newObject: SoundboardItem) => {
  const request = axios.post(`${baseUrl}`, newObject)
  const response = await request
  return response.data
}

const update = async (id: string, newObject: SoundboardItemModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const soundboardService = {
  create,
  getAll,
  update
}

export default soundboardService

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

const createItem = async (newObject: SoundboardItem) => {
  const request = axios.post(`${baseUrl}`, newObject)
  const response = await request
  return response.data
}

const updateItem = async (id: string, newObject: SoundboardItemModel) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  const response = await request
  return response.data
}

const deleteItem = async (id: string) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  const response = await request
  return response.data
}

const soundboardService = {
  createItem,
  deleteItem,
  getAll,
  updateItem
}

export default soundboardService

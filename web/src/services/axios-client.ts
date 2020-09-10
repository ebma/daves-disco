import axios from "axios"

const axiosClient = axios.create({
  baseURL: process.env.BOT_SERVER_PATH
})

export function setAuthToken(token: string) {
  axiosClient.interceptors.request.use(function(config) {
    config.headers.Authorization = `bearer ${token}`
    return config
  })
}

export default axiosClient

import axios from "axios"

const axiosClient = axios.create({
  baseURL: process.env.BOT_SERVER_PATH
})

function getTokenFromStorage() {
  return localStorage.getItem("auth-token")
}

axiosClient.interceptors.request.use(function(config) {
  const token = getTokenFromStorage()
  config.headers.Authorization = `bearer ${token}`

  return config
})

export default axiosClient

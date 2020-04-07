import axios from "axios"

const axiosClient = axios.create({
  baseURL: process.env.BOT_SERVER_PATH
})

export default axiosClient

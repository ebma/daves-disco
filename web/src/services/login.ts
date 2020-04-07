import axios from "./axios-client"

const baseUrl = "/api/login"

const login = async (credentials: Credentials): Promise<string> => {
  const response = await axios.post(baseUrl, credentials)
  return response.data.token
}

const loginService = {
  login
}

export default loginService

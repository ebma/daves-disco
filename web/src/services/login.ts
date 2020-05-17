import axios from "./axios-client"

const baseUrl = "/api/login"

const login = async (credentials: Credentials): Promise<string> => {
  return axios
    .post(baseUrl, credentials)
    .then(response => response.data.token)
    .catch(error => {
      if (error.response) {
        throw Error(`Request failed with status ${error.response.status}: ${error.response.data.error}`)
      } else {
        throw error
      }
    })
}

const loginService = {
  login
}

export default loginService

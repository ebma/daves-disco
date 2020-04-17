import axios from "./axios-client"

const baseUrl = "/api/youtube"

const findTracks = async (searchTerm: string): Promise<TrackSearchResult[]> => {
  const response = await axios.get(baseUrl, {
    params: {
      q: searchTerm
    }
  })
  return response.data
}

const youtubeService = {
  findTracks
}

export default youtubeService

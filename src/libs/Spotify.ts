import SpotifyWebAPI from "spotify-web-api-node"
import config from "../utils/config"
import { trackError } from "../utils/trackError"

class Spotify {
  private clientID: string
  private clientSecret: string
  private lastTokenCheck: number = 0
  private spotifyWebAPI: SpotifyWebAPI

  constructor(clientID: string, clientSecret: string) {
    if (!clientID || !clientSecret) {
      throw new Error("Spotify Credentials cannot be undefined!")
    }

    this.clientID = clientID
    this.clientSecret = clientSecret
    this.spotifyWebAPI = new SpotifyWebAPI({
      clientId: this.clientID,
      clientSecret: this.clientSecret
    })
  }

  async getSpotifyPlaylist(playlistID: string): Promise<Playlist | null> {
    try {
      await this.checkAccessToken()
      const playlistData = await this.spotifyWebAPI.getPlaylist(playlistID)
      const name = playlistData.body.name

      const total = playlistData.body.tracks.total
      let items = playlistData.body.tracks.items
      while (items.length < total) {
        await this.checkAccessToken()
        const playlistTracksData = await this.spotifyWebAPI.getPlaylistTracks(playlistID, {
          offset: items.length,
          limit: 100
        })
        items = items.concat(playlistTracksData.body.items)
      }

      return {
        id: playlistData.body.id,
        name,
        owner: playlistData.body.owner.display_name,
        source: "spotify",
        thumbnail: {
          small: playlistData.body.images.length >= 3 ? playlistData.body.images[2].url : undefined,
          medium: playlistData.body.images.length >= 2 ? playlistData.body.images[1].url : undefined,
          large: playlistData.body.images.length >= 1 ? playlistData.body.images[0].url : undefined
        },
        tracks: items.map(item => ({
          artists: item.track.artists.map(x => x.name).join(", "),
          id: item.track.id,
          source: "spotify",
          title: item.track.name,
          thumbnail: {
            small: item.track.album.images.length >= 3 ? item.track.album.images[2].url : undefined,
            medium: item.track.album.images.length >= 2 ? item.track.album.images[1].url : undefined,
            large: item.track.album.images.length >= 1 ? item.track.album.images[0].url : undefined
          },
          trackID: item.track.uri
        })),
        uri: playlistData.body.uri
      }
    } catch (error) {
      trackError(error, "Spotify.getSpotifyPlaylist")
      return null
    }
  }

  private checkAccessToken = async () => {
    if (Date.now() + 5000 > this.lastTokenCheck) {
      const data = await this.spotifyWebAPI.clientCredentialsGrant()
      this.spotifyWebAPI.setAccessToken(data.body.access_token)
      this.lastTokenCheck = Date.now()
    }
  }
}

const GlobalInstance = new Spotify(config.SPOTIFY_CLIENT_ID, config.SPOTIFY_CLIENT_SECRET)

export default GlobalInstance

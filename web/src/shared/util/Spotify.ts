import { config } from "dotenv"
import SpotifyWebAPI from "spotify-web-api-node"
import { trackError } from "./trackError"

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

  isSpotifyPlaylistURI(term: string) {
    const regex = /spotify:playlist:[\d\w]+/g
    return term.match(regex)
  }

  isSpotifyTrack(track: Track): track is SpotifyTrack {
    return track.source === "spotify"
  }

  async getSpotifyPlaylist(playlistID: string): Promise<Playlist | null> {
    try {
      await this.checkAccessToken()
      const playlistData = await this.spotifyWebAPI.getPlaylist(playlistID)
      const name = playlistData.body.name

      const total = playlistData.body.tracks.total
      const defaultArt = playlistData.body.images.length
        ? playlistData.body.images[0].url
        : "http://beatmakerleague.com/images/No_Album_Art.png"
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
        name,
        owner: playlistData.body.owner.display_name,
        tracks: items.map(item => ({
          artists: item.track.artists.map(x => x.name).join(", "),
          initialized: false,
          source: "spotify",
          title: item.track.name,
          thumbnail: item.track.album.images.length ? item.track.album.images[0].url : defaultArt,
          trackID: item.track.uri,
          url: ""
        }))
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

config()

const GlobalInstance = new Spotify(process.env.SPOTIFY_CLIENT_ID!, process.env.SPOTIFY_CLIENT_SECRET!)

export default GlobalInstance

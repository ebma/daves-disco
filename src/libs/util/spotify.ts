import SpotifyWebAPI from "spotify-web-api-node"
import { trackError } from "../../shared/trackError"

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

if (!clientId || !clientSecret) {
  throw new Error("ClientId or clientSecret are undefined... You can't use the spotify web api without them!")
}

let lastTokenCheck: number = 0
const spotifyWebAPI = new SpotifyWebAPI({
  clientId,
  clientSecret
})

export function isSpotifyPlaylistURI(term: string) {
  const regex = /spotify:playlist:[\d\w]+/g
  return term.match(regex)
}

export async function getSpotifyPlaylist(playlistID: string): Promise<Playlist | null> {
  try {
    await checkAccessToken()
    const playlistData = await spotifyWebAPI.getPlaylist(playlistID)
    const name = playlistData.body.name

    const total = playlistData.body.tracks.total
    const defaultArt = playlistData.body.images.length
      ? playlistData.body.images[0].url
      : "http://beatmakerleague.com/images/No_Album_Art.png"
    let items = playlistData.body.tracks.items
    while (items.length < total) {
      await checkAccessToken()
      const playlistTracksData = await spotifyWebAPI.getPlaylistTracks(playlistID, { offset: items.length, limit: 100 })
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
    trackError(error, this)
    return null
  }
}

const checkAccessToken = async () => {
  if (Date.now() + 5000 > lastTokenCheck) {
    const data = await spotifyWebAPI.clientCredentialsGrant()
    spotifyWebAPI.setAccessToken(data.body.access_token)
    lastTokenCheck = Date.now()
  }
}

import ytdl from "ytdl-core"

function describesYoutubePlaylist(term: string): boolean {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
  const valid = term.match(regex)
  return valid ? true : false
}

function isYoutubeVideo(url: string): boolean {
  return ytdl.validateURL(url)
}

function isYoutubePlaylist(playlist: Playlist): playlist is YoutubePlaylist {
  return playlist.source === "youtube"
}

function createTracksFromSearchTerm(term: string, maxResults: number): Promise<Track[]> {
  return new Promise<Track[]>((resolve, reject) => {
    // TODO make request to server and request tracks
    resolve([])
  })
}

export const YoutubeHelper = {
  describesYoutubePlaylist,
  isYoutubeVideo,
  isYoutubePlaylist
}

function isSpotifyPlaylistURI(term: string) {
  const regex = /spotify:playlist:[\d\w]+/g
  return term.match(regex)
}

function isSpotifyTrack(track: Track): track is SpotifyTrack {
  return track.source === "spotify"
}

function isSpotifyPlaylist(playlist: Playlist): playlist is SpotifyPlaylist {
  return playlist.source === "spotify"
}

function getIDFromUri(uri: string) {
  const split = uri.split(":")
  const id = split[split.length - 1]
  return id
}

export const SpotifyHelper = {
  isSpotifyTrack,
  isSpotifyPlaylist,
  isSpotifyPlaylistURI,
  getIDFromUri
}

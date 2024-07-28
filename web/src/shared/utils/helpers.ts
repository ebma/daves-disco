// import ytdl from "@distube/ytdl-core"

function describesYoutubePlaylist(term: string): boolean {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
  const valid = term.match(regex)
  return valid ? true : false
}

function isYoutubeVideo(url: string): boolean {
  // return ytdl.validateURL(url)
  return true
}

function isYoutubePlaylist(playlist: Playlist): playlist is YoutubePlaylist {
  return playlist.source === "youtube"
}

export const YoutubeHelper = {
  describesYoutubePlaylist,
  isYoutubeVideo,
  isYoutubePlaylist
}

function isSpotifyPlaylistUri(term: string) {
  const regex = /spotify:playlist:[\d\w]+/g
  return term.match(regex)
}

function isSpotifyPlaylistUrl(term: string) {
  const regex = /^https:\/\/open\.spotify\.com\/playlist\/[\d\w]+\??[\d\w=&]+$/g
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

function getIDFromUrl(url: string) {
  const urlObject = new URL(url)
  const pathNames = urlObject.pathname.split("/")
  const id = pathNames[pathNames.length - 1]
  return id
}

export const SpotifyHelper = {
  isSpotifyTrack,
  isSpotifyPlaylist,
  isSpotifyPlaylistUri,
  isSpotifyPlaylistUrl,
  getIDFromUri,
  getIDFromUrl
}

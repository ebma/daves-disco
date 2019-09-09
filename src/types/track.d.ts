interface YoutubeTrack {
  title: string
  url: string
  thumbnail: string
  description?: string
  publishedAt?: string
}

interface SpotifyTrack {
  title: string,
  url: string, 
  thumbnail: string,
  artists: string,
  trackID: string
}

interface SpotifyPlaylist{
  name: string,
  owner: string,
  tracks: SpotifyTrack[]
}
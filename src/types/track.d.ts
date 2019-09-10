interface Track {
  title: string
  url: string
  thumbnail?: string
  description?: string
  publishedAt?: string
  source: "spotify" | "youtube"
}

interface SpotifyTrack extends Track {
  artists: string
  initialized: boolean
  trackID: string
}

interface Playlist {
  name: string
  owner?: string
  tracks: Track[]
}

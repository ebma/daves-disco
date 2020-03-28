// --- PLAYER ---

interface Track {
  title: string
  url: string
  thumbnail?: string
  description?: string
  publishedAt?: string
  source: "spotify" | "youtube"
  trackID: string
}

interface SpotifyTrack extends Track {
  artists: string
  source: "spotify"
}

interface Playlist {
  name: string
  owner?: string
  tracks: Track[]
}

// --- DISCORD ---

type MessageID = number
type GuildID = string
type UserID = string
type ReducedGuilds = { id: string; name: string }[]
type ReducedMembers = { id: string; name: string }[]

type ConnectionState = "disconnected" | "reconnecting" | "connected"

interface MusicPlayerSubjectMessage {
  messageType: "status" | "info" | "error" | "debug"
  message: string
  data?: any
}

interface StreamManagerObservableMessage {
  type: "start" | "finish" | "error" | "debug"
  data?: any
}

// --- PLAYER ---

type MusicItem = TrackModel | PlaylistModel

interface Thumbnail {
  small?: string
  medium?: string
  large?: string
}

interface Track {
  artists?: string
  id: string
  title: string
  url?: string
  thumbnail?: Thumbnail
  description?: string
  publishedAt?: string
  source: "spotify" | "youtube"
}

interface TrackModel extends Track {
  favourite?: boolean
  guild: string
  lastTouchedAt?: Date
}

interface SpotifyTrack extends Track {
  artists: string
  source: "spotify"
}

interface YoutubeTrack extends Track {
  source: "youtube"
}

interface Playlist {
  id: string
  name: string
  owner?: string
  source: "spotify" | "youtube"
  tracks?: Track[]
  thumbnail?: Thumbnail
  uri?: string
  url?: string
}

interface PlaylistModel extends Playlist {
  favourite?: boolean
  guild: string
  lastTouchedAt?: Date
}

interface SpotifyPlaylist extends Playlist {
  source: "spotify"
  uri: string
}

interface YoutubePlaylist extends Playlist {
  source: "youtube"
  url: string
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

// --- AUTH ---

interface DecodedToken {
  guildID: string
  userID: string
}

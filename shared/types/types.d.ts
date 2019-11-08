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

interface ControlMessage {
  guildID?: string
  messageID: number
  type: ControlMessageType
  data: any
}

interface ControlMessageResponse {
  type: ControlMessage["type"]
  messageID: number
  result?: any
  error?: string
}

interface CommandMessage {
  command: CommandMessageType
  messageID: number
  userID: string
  guildID: string
  data: any
}

interface InfoMessage {
  type: InfoMessageType
  data: any
}

type InfoMessageType = "currentSong" | "currentQueue" | "paused" | "resumed" | "volume"

type ControlMessageType = "getGuilds" | "getUsers" | "getCurrentSong" | "getCurrentQueue" | "getVolume"

// these have to equal the aliases of the actual commands as this is the criteria for
// finding the corresponding command
type CommandMessageType = "pause" | "resume" | "skip" | "skip-previous" | "volume"

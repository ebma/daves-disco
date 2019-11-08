export interface Track {
  title: string
  url: string
  thumbnail?: string
  description?: string
  publishedAt?: string
  source: "spotify" | "youtube"
}

export interface SpotifyTrack extends Track {
  artists: string
  initialized: boolean
  trackID: string
}

export interface ControlMessage {
  guildID?: string
  messageID: number
  type: ControlMessageType
  data: any
}

export interface ControlMessageResponse {
  type: ControlMessage["type"]
  messageID: number
  result?: any
  error?: string
}

export interface CommandMessage {
  command: CommandMessageType
  messageID: number
  userID: string
  guildID: string
  data: any
}

export interface InfoMessage {
  type: InfoMessageType
  data: any
}

export type InfoMessageType = "currentSong" | "currentQueue" | "paused" | "resumed" | "volume"

export type ControlMessageType = "getGuilds" | "getUsers" | "getCurrentSong" | "getCurrentQueue" | "getVolume"

// these have to equal the aliases of the actual commands as this is the criteria for
// finding the corresponding command
export type CommandMessageType = "pause" | "resume" | "skip" | "skip-previous" | "volume"

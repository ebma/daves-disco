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
  type: "getGuilds" | "getUsers" | "getCurrentSong" | "getCurrentQueue"
}

export interface ControlMessageResponse {
  type: ControlMessage["type"]
  messageID: number
  result?: any
  error?: string
}

export interface CommandMessage {
  command: string
  messageID: number
  userID: string
  guildID: string
  payload: string
}

export interface InfoMessage {
  type: InfoMessageType
  data: any
}

export type InfoMessageType = "currentSong" | "currentQueue" | "paused" | "resumed"

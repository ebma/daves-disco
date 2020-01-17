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
  trackID: string
  source: "spotify"
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
type CommandMessageType = "play" | "pause" | "resume" | "skip" | "skip-previous" | "volume"

type StreamOptions = {
  seek?: number
  volume?: number
  passes?: number
  bitrate?: number | "auto"
}

interface StreamHolder {
  dispatcher: Dispatcher

  disconnect(): void
  playStream(stream: Readable, options?: StreamOptions): Dispatcher

  on(event: string, listener: Function): this
  once(event: string, listener: Function): this
}

interface Dispatcher {
  destroyed: boolean
  passes: number
  paused: boolean
  volume: number
  end(reason?: string): void
  pause(): void
  resume(): void
  setVolume(volume: number): void

  on(event: "debug", listener: (information: string) => void): this
  on(event: "end", listener: (reason: string) => void): this
  on(event: "error", listener: (err: Error) => void): this
  on(event: "speaking", listener: (value: boolean) => void): this
  on(event: "start", listener: () => void): this
  on(event: "volumeChange", listener: (oldVolume: number, newVolume: number) => void): this
  on(event: string, listener: Function): this

  once(event: "debug", listener: (information: string) => void): this
  once(event: "end", listener: (reason: string) => void): this
  once(event: "error", listener: (err: Error) => void): this
  once(event: "speaking", listener: (value: boolean) => void): this
  once(event: "start", listener: () => void): this
  once(event: "volumeChange", listener: (oldVolume: number, newVolume: number) => void): this

  once(event: string, listener: Function): this
}

interface MusicPlayerSubjectMessage {
  messageType: "status" | "info" | "error" | "debug"
  message: string
  data?: any
}

interface Channel {
  full: boolean
  join(): Promise<StreamHolder>
  leave(): void
}

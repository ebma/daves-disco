// --- PLAYER ---

interface Thumbnail {
  small?: string
  medium?: string
  large?: string
}

interface TrackSearchResult {
  title: string
  url: string
}

interface Track {
  artists?: string
  identifier: string
  title: string
  url?: string
  thumbnail?: Thumbnail
  description?: string
  publishedAt?: string
  source: "spotify" | "youtube" | "radio"
}

interface TrackModel extends Track {
  _id: string
  favourite: { guild: GuildID; favourite: boolean }[]
  lastTouchedAt: { guild: GuildID; date: string }[]
  touchedByUser: { guild: GuildID; touched: boolean }[]
}

interface SpotifyTrack extends Track {
  artists: string
  source: "spotify"
}

interface YoutubeTrack extends Track {
  source: "youtube"
}

interface Playlist {
  identifier: string
  name: string
  owner?: string
  source: "spotify" | "youtube"
  tracks?: Track[]
  thumbnail?: Thumbnail
  uri?: string
  url?: string
}

interface PlaylistModel extends Playlist {
  _id: string
  favourite: { guild: GuildID; favourite: boolean }[]
  lastTouchedAt: { guild: GuildID; date: string }[]
  tracks: TrackModel[]
}

interface SpotifyPlaylist extends Playlist {
  source: "spotify"
  uri: string
}

interface YoutubePlaylist extends Playlist {
  source: "youtube"
  url: string
}

type TrackModelID = string

interface QueuedTrack {
  trackModelID: TrackModelID
  uuid: string
}

interface QueuedTrackModel {
  trackModel: TrackModel
  uuid: string
}

interface PlayerModel {
  available: boolean
  currentTrackID: QueuedTrack | null
  loopState: LoopState
  paused: boolean
  queueIDs: QueuedTrack[]
  volume: number
}

interface Radio {
  name: string
  source: string
}

// --- SOUNDBOARD ---

interface SoundboardItem {
  source: string
  name: string
  guild: string
}

interface SoundboardItemModel extends SoundboardItem {
  _id: string
}

// --- DISCORD ---

type MessageID = number
type GuildID = string
type UserID = string
type LoopState = "none" | "repeat-one" | "repeat-all"

type ReducedGuilds = { id: string; name: string }[]
type ReducedMembers = { id: string; name: string }[]

type ConnectionState = "disconnected" | "reconnecting" | "connected" | "authenticated"

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

interface Credentials {
  guildID: string
  userID: string
}

interface DecodedToken {
  guildID: string
  userID: string
}

type UnsubscribeFn = () => void

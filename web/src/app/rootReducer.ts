import { combineReducers } from "@reduxjs/toolkit"
import cacheReducer, { CacheState } from "../redux/cacheSlice"
import guildsReducer, { GuildsState } from "../redux/guildsSlice"
import playerReducer, { PlayerState } from "../redux/playerSlice"
import playlistsReducer, { PlaylistsState } from "../redux/playlistsSlice"
import socketReducer, { SocketState } from "../redux/socketSlice"
import soundboardReducer, { SoundboardState } from "../redux/soundboardsSlice"
import tracksReducer, { TracksState } from "../redux/tracksSlice"
import userReducer, { UserState } from "../redux/userSlice"

const rootReducer = combineReducers({
  cache: cacheReducer,
  guilds: guildsReducer,
  playlists: playlistsReducer,
  player: playerReducer,
  socket: socketReducer,
  soundboard: soundboardReducer,
  tracks: tracksReducer,
  user: userReducer
})

export type RootState = {
  cache: CacheState
  guilds: GuildsState
  playlists: PlaylistsState
  player: PlayerState
  socket: SocketState
  soundboard: SoundboardState
  user: UserState
  tracks: TracksState
}

export default rootReducer

import { combineReducers } from "@reduxjs/toolkit"
import playlistsReducer, { PlaylistsState } from "../redux/playlistsSlice"
import guildsReducer, { GuildsState } from "../redux/guildsSlice"
import socketReducer, { SocketState } from "../redux/socketSlice"
import playerReducer, { PlayerState } from "../redux/playerSlice"
import userReducer, { UserState } from "../redux/userSlice"
import soundboardReducer, { SoundboardState } from "../redux/soundboardsSlice"
import tracksReducer, { TracksState } from "../redux/tracksSlice"

const rootReducer = combineReducers({
  guilds: guildsReducer,
  playlists: playlistsReducer,
  player: playerReducer,
  socket: socketReducer,
  soundboard: soundboardReducer,
  tracks: tracksReducer,
  user: userReducer
})

export type RootState = {
  guilds: GuildsState
  playlists: PlaylistsState
  player: PlayerState
  socket: SocketState
  soundboard: SoundboardState
  user: UserState
  tracks: TracksState
}
export default rootReducer

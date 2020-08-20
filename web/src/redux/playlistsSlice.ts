import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import PlaylistService from "../services/playlists"
import { AppThunk } from "../app/store"
import { Messages } from "../shared/ipc"
import { subscribeToMessages, sendMessage } from "./socketSlice"

export interface PlaylistsState {
  error: string | null
  playlists: PlaylistModel[]
}

const initialState: PlaylistsState = {
  error: null,
  playlists: []
}

const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setPlaylist(state, action: PayloadAction<PlaylistModel>) {
      const newPlaylist = action.payload
      const foundIndex = state.playlists.findIndex(playlist => playlist.id === newPlaylist.id)
      if (foundIndex !== -1) {
        state.playlists[foundIndex] = newPlaylist
      } else {
        state.playlists.push(newPlaylist)
      }
    },
    setPlaylists(state, action: PayloadAction<PlaylistModel[]>) {
      const newPlaylists = action.payload
      // carry over previously fetched tracks
      for (const existingPlaylist of state.playlists) {
        const newPlaylist = newPlaylists.find(p => (p.id = existingPlaylist.id))
        if (newPlaylist) {
          newPlaylist.tracks = existingPlaylist.tracks
        }
      }
      state.playlists = newPlaylists
    }
  }
})

export const { setError, setPlaylist, setPlaylists } = playlistsSlice.actions

export default playlistsSlice.reducer

export const fetchPlaylistByID = (playlistID: string, useCached?: boolean): AppThunk<Promise<PlaylistModel>> => async (
  dispatch,
  getState
) => {
  try {
    const playlist = await PlaylistService.get(playlistID, useCached)
    dispatch(setPlaylist(playlist))
    return playlist
  } catch (error) {
    dispatch(setError(error))
    return Promise.reject(error)
  }
}
export const fetchPlaylists = (): AppThunk<Promise<PlaylistModel[]>> => async (dispatch, getState) => {
  const { user } = getState().user
  try {
    const playlists = await PlaylistService.getAll(user?.guildID)
    dispatch(setPlaylists(playlists))
    return playlists
  } catch (error) {
    dispatch(setError(error))
    return Promise.reject(error)
  }
}

export const subscribePlaylists = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribePlaylistsChange = dispatch(
      subscribeToMessages(user.guildID, Messages.PlaylistsChange, () => dispatch(fetchPlaylists()))
    )

    return () => unsubscribePlaylistsChange
  } else {
    return () => undefined
  }
}

export const playPlaylist = (playlist: Playlist): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayPlaylist, playlist)).catch(error => {
      dispatch(setError(error))
      throw error
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const updatePlaylist = (playlist: PlaylistModel): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const updatedPlaylist = await PlaylistService.update(playlist._id, playlist)
  dispatch(setPlaylist(updatedPlaylist))
}

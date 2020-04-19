import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import TrackService from "../services/tracks"
import { AppThunk } from "../app/store"
import { Messages } from "../shared/ipc"
import { subscribeToMessages, sendMessage } from "./socketSlice"
import youtubeService from "../services/youtube"

export interface TracksState {
  error: string | null
  tracks: TrackModel[]
}

const initialState: TracksState = {
  error: null,
  tracks: []
}

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setTrack(state, action: PayloadAction<TrackModel>) {
      const newTrack = action.payload
      const foundIndex = state.tracks.findIndex(track => track.id === newTrack.id)
      if (foundIndex !== -1) {
        state.tracks[foundIndex] = newTrack
      } else {
        state.tracks.push(newTrack)
      }
    },
    setTracks(state, action: PayloadAction<TrackModel[]>) {
      state.tracks = action.payload
    }
  }
})

export const { setError, setTrack, setTracks } = tracksSlice.actions

export default tracksSlice.reducer

export const fetchTracks = (): AppThunk<Promise<TrackModel[]>> => async (dispatch, getState) => {
  const { user } = getState().user
  try {
    const tracks = await TrackService.getAll(user?.guildID)
    dispatch(setTracks(tracks))
    return tracks
  } catch (error) {
    dispatch(setError(error))
    return Promise.reject(error)
  }
}

export const subscribeTracks = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribeTracksChange = dispatch(
      subscribeToMessages(user.guildID, Messages.TracksChange, () => dispatch(fetchTracks()))
    )

    return () => unsubscribeTracksChange
  } else {
    return () => undefined
  }
}

export const playTrack = (track: Track): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayTrack, user.guildID, user.id, track)).catch(error => {
      dispatch(setError(error))
      throw error
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const getTrackFromSearchTerm = (searchTerm: string) => {
  return youtubeService.findTracks(searchTerm)
}

export const updateTrack = (track: TrackModel): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const updatedTrack = await TrackService.update(track._id, track)
  dispatch(setTrack(updatedTrack))
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"
import { AppThunk } from "../app/store"
import TrackService from "../services/tracks"
import youtubeService from "../services/youtube"
import { Messages } from "../shared/ipc"
import { sendMessage, subscribeToMessages } from "./socketSlice"

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
      const foundIndex = state.tracks.findIndex(track => track._id === newTrack._id)
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
    const recents = await TrackService.getAll(user?.guildID, 20, "desc")
    const favourites = await TrackService.getFavourites(user?.guildID)
    const tracks = recents.concat(favourites)
    const dedup = _.uniqBy(tracks, trackModel => trackModel._id)
    dispatch(setTracks(dedup))
    return tracks
  } catch (error) {
    dispatch(setError(error.message))
    return Promise.reject(error)
  }
}

export const addTracks = (newTracks: TrackModel[]): AppThunk<void> => async (dispatch, getState) => {
  const { tracks } = getState().tracks
  try {
    const combinedTracks = tracks.concat(newTracks)
    const dedup = _.uniqBy(combinedTracks, trackModel => trackModel._id)
    dispatch(setTracks(dedup))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

export const subscribeTracks = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribeTracksChange = dispatch(subscribeToMessages(Messages.TracksChange, () => dispatch(fetchTracks())))

    return () => unsubscribeTracksChange
  } else {
    return () => undefined
  }
}

export const playTrack = (track: Track): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayTrack, track)).catch(error => {
      dispatch(setError(error.message))
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

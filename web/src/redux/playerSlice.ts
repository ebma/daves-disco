import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Messages } from "../shared/ipc"
import { AppThunk } from "../app/store"
import { sendMessage, subscribeToMessages } from "./socketSlice"
import playerService from "../services/player"
import { setTracks } from "./tracksSlice"
import trackService from "../services/tracks"

export interface PlayerState {
  available: boolean
  currentTrack: TrackModel | null
  currentTrackID: TrackModelID | null
  error: string | null
  paused: boolean
  loopState: LoopState
  queueIDs: TrackModelID[]
  queue: TrackModel[]
  volume: number
}

const initialState: PlayerState = {
  available: false,
  currentTrack: null,
  currentTrackID: null,
  error: null,
  loopState: "none",
  paused: false,
  queue: [],
  queueIDs: [],
  volume: 50
}

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setAvailable(state, action: PayloadAction<boolean>) {
      state.available = action.payload
    },
    setCurrentTrack(state, action: PayloadAction<TrackModel>) {
      state.currentTrack = action.payload
    },
    setCurrentTrackID(state, action: PayloadAction<TrackModelID>) {
      state.currentTrackID = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.paused = action.payload
    },
    setLoopState(state, action: PayloadAction<LoopState>) {
      state.loopState = action.payload
    },
    setQueue(state, action: PayloadAction<TrackModel[]>) {
      state.queue = action.payload
    },
    setQueueIDs(state, action: PayloadAction<TrackModelID[]>) {
      state.queueIDs = action.payload
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload
    },
    setPlayerState(
      state,
      action: PayloadAction<PlayerModel & { currentTrack: TrackModel | null; queue: TrackModel[] }>
    ) {
      const playerModel = action.payload

      state.available = playerModel.available
      state.currentTrack = playerModel.currentTrack
      state.currentTrackID = playerModel.currentTrackID
      state.loopState = playerModel.loopState
      state.paused = playerModel.paused
      state.queue = playerModel.queue
      state.queueIDs = playerModel.queueIDs
      state.volume = playerModel.volume
    }
  },
  extraReducers: builder => {
    builder.addCase(setTracks, (state, action) => {
      const tracks = action.payload
      state.currentTrack = tracks.find(track => track._id === state.currentTrackID) ?? null
      state.queue = state.queueIDs
        .map(trackID => tracks.find(track => track._id === trackID))
        .filter(track => track) as TrackModel[]
    })
  }
})

export const {
  setAvailable,
  setCurrentTrack,
  setCurrentTrackID,
  setQueue,
  setQueueIDs,
  setError,
  setPaused,
  setLoopState,
  setPlayerState,
  setVolume
} = playerSlice.actions

export default playerSlice.reducer

const getPopulatedTrack = (trackID: TrackModelID): AppThunk<Promise<TrackModel> | undefined> => async (
  dispatch,
  getState
) => {
  const track = await trackService.getTrack(trackID)
  return track
}

const getPopulatedTracks = (trackIDs: string[]): AppThunk<Promise<TrackModel[]>> => async (dispatch, getState) => {
  const tracks = await trackService.getList(trackIDs)
  return tracks
}

export const fetchPlayerState = (): AppThunk => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const playerState = await playerService.getPlayer(user.guildID)
    const currentTrack = playerState.currentTrackID
      ? (await dispatch(getPopulatedTrack(playerState.currentTrackID))) ?? null
      : null
    const queue = await dispatch(getPopulatedTracks(playerState.queueIDs))

    return dispatch(setPlayerState({ ...playerState, currentTrack, queue }))
  }
}

export const subscribePlayerState = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribePlayerChange = dispatch(
      subscribeToMessages(user.guildID, Messages.PlayerChange, () => dispatch(fetchPlayerState()))
    )

    const unsubscribeErrors = dispatch(
      subscribeToMessages(user.guildID, Messages.Error, error =>
        dispatch(setError(error?.message ? error.message : error))
      )
    )
    return () => {
      unsubscribePlayerChange()
      unsubscribeErrors()
    }
  } else {
    return () => undefined
  }
}

export const skipTracks = (amount: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Skip, amount)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const pausePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Pause)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const resumePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Resume)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const skipPreviousTracks = (amount: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.SkipPrevious, amount)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const setPlayerVolume = (volume: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Volume, volume)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const stopPlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Stop)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const shuffleTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Shuffle)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}
export const clearTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Clear)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const playSearchTerm = (searchTerm: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Play, searchTerm)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const playRadio = (radio: Radio): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayRadio, radio)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const updateLoopState = (loopState: LoopState): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Loop, loopState)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const updateQueue = (newQueueIDs: TrackModelID[]): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const updatedQueueIDs = await playerService.updateQueue(user.guildID, newQueueIDs)
    const updatedQueue = await dispatch(getPopulatedTracks(updatedQueueIDs))
    dispatch(setQueueIDs(updatedQueueIDs))
    dispatch(setQueue(updatedQueue))
  } else {
    dispatch(setError("User not available"))
  }
}

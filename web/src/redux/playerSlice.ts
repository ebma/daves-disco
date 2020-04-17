import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Messages } from "../shared/ipc"
import { AppThunk } from "../app/store"
import { sendMessage, subscribeToMessages } from "./socketSlice"
import playerService from "../services/player"

export interface PlayerState {
  available: boolean
  currentTrack: TrackModel | null
  error: string | null
  paused: boolean
  queue: TrackModel[]
  volume: number
}

const initialState: PlayerState = {
  available: false,
  currentTrack: null,
  error: null,
  paused: false,
  queue: [],
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
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    setPaused(state, action: PayloadAction<boolean>) {
      state.paused = action.payload
    },
    setQueue(state, action: PayloadAction<TrackModel[]>) {
      state.queue = action.payload
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload
    },
    setPlayerState(state, action: PayloadAction<PlayerModel>) {
      const playerModel = action.payload

      state.available = playerModel.available
      state.currentTrack = playerModel.currentTrack
      state.paused = playerModel.paused
      state.queue = playerModel.queue
      state.volume = playerModel.volume
    }
  }
})

export const {
  setAvailable,
  setCurrentTrack,
  setQueue,
  setError,
  setPaused,
  setPlayerState,
  setVolume
} = playerSlice.actions

export default playerSlice.reducer

export const fetchPlayerState = (): AppThunk => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const playerState = await playerService.getPlayer(user.guildID)
    return dispatch(setPlayerState(playerState))
  }
}

export const subscribePlayerState = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribePlayerChange = dispatch(
      subscribeToMessages(user.guildID, Messages.PlayerChange, () => dispatch(fetchPlayerState()))
    )

    const unsubscribeTracksChange = dispatch(
      subscribeToMessages(user.guildID, Messages.TracksChange, () => dispatch(fetchPlayerState()))
    )

    const unsubscribeErrors = dispatch(
      subscribeToMessages(user.guildID, Messages.Error, error =>
        dispatch(setError(error?.message ? error.message : error))
      )
    )
    return () => {
      unsubscribeTracksChange()
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
    return dispatch(sendMessage(Messages.Skip, user.guildID, amount)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const pausePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Pause, user.guildID)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const resumePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Resume, user.guildID)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const skipPreviousTracks = (amount: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.SkipPrevious, user.guildID, amount)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const setPlayerVolume = (volume: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Volume, user.guildID, volume)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const stopPlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Stop, user.guildID)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const shuffleTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Shuffle, user.guildID)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}
export const clearTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Clear, user.guildID)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const playSearchTerm = (searchTerm: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Play, user.guildID, user.id, searchTerm)).catch(error => {
      dispatch(setError(error))
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const updateQueue = (newQueue: TrackModel[]): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const updatedQueue = await playerService.updateQueue(user.guildID, newQueue)
    dispatch(setQueue(updatedQueue))
  } else {
    dispatch(setError("User not available"))
  }
}

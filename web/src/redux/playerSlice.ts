import { AppThunk } from "../app/store"
import { Messages } from "../shared/ipc"
import { sendMessage } from "./socketSlice"

export const skipTracks = (amount: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Skip, amount)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const pausePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Pause)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const resumePlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Resume)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const skipPreviousTracks = (amount: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.SkipPrevious, amount)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const setPlayerVolume = (volume: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Volume, volume)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const stopPlayer = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Stop)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const shuffleTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Shuffle)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}
export const clearTracks = (): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Clear)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const playSearchTerm = (searchTerm: string): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Play, searchTerm)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const playRadio = (radio: Radio): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayRadio, radio)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

export const updateLoopState = (loopState: LoopState): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.Loop, loopState)).catch(error => {
      console.error(error)
    })
  } else {
    console.error("User not available")
  }
}

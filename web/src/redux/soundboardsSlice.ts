import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../app/store"
import soundboardService from "../services/soundboards"
import { Messages } from "../shared/ipc"
import { subscribeToMessages, sendMessage } from "./socketSlice"

export interface SoundboardState {
  error: string | null
  items: SoundboardItemModel[]
}

const initialState: SoundboardState = {
  error: null,
  items: []
}

const soundboardSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    setItem(state, action: PayloadAction<SoundboardItemModel>) {
      const newItem = action.payload
      const foundIndex = state.items.findIndex(item => item.id === newItem.id)
      if (foundIndex !== -1) {
        state.items[foundIndex] = newItem
      } else {
        state.items.push(newItem)
      }
    },
    setItems(state, action: PayloadAction<SoundboardItemModel[]>) {
      state.items = action.payload
    }
  }
})

export const { setError, setItem, setItems } = soundboardSlice.actions

export default soundboardSlice.reducer

export const fetchItems = (): AppThunk<Promise<SoundboardItemModel[]>> => async (dispatch, getState) => {
  const { user } = getState().user
  try {
    const items = await soundboardService.getAll(user?.guildID)
    dispatch(setItems(items))
    return items
  } catch (error) {
    dispatch(setError(error))
    return Promise.reject(error)
  }
}

export const subscribeItems = (): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    const unsubscribeItemsChange = dispatch(
      subscribeToMessages(user.guildID, Messages.SoundboardItemsChange, () => dispatch(fetchItems()))
    )

    return () => unsubscribeItemsChange
  } else {
    return () => undefined
  }
}

export const playSound = (source: string, volume: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlaySound, user.guildID, user.id, source, volume)).catch(error => {
      dispatch(setError(error))
      throw error
    })
  } else {
    dispatch(setError("User not available"))
  }
}

export const updateItem = (item: SoundboardItemModel): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const updatedItem = await soundboardService.update(item._id, item)
  dispatch(setItem(updatedItem))
}

export const createItem = (item: { name: string; source: string }): AppThunk<Promise<void>> => async (
  dispatch,
  getState
) => {
  const { user } = getState().user
  const { items } = getState().soundboard
  const id = String(items.length)
  if (user) {
    const createdItem = await soundboardService.create({ ...item, guild: user.guildID, id })
    dispatch(setItem(createdItem))
  }
}

import { AppThunk } from "../app/store"
import { Messages } from "../shared/ipc"
import { sendMessage } from "./socketSlice"

export const playSound = (source: string, volume: number): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlaySound, source, volume)).catch(error => {
      console.error(error)
    })
  }
}

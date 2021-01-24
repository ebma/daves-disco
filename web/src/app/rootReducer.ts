import { combineReducers } from "@reduxjs/toolkit"
import socketReducer, { SocketState } from "../redux/socketSlice"
import userReducer, { UserState } from "../redux/userSlice"

const rootReducer = combineReducers({
  socket: socketReducer,
  user: userReducer
})

export type RootState = {
  socket: SocketState
  user: UserState
}

export default rootReducer

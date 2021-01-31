import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit"
import { AppThunk } from "../app/store"

type AuthError = "jwt-expired"

export interface SocketState {
  authError: AuthError | null
  autoConnect: boolean
  connectionState: ConnectionState
  error: string | null
}

const initialState: SocketState = {
  autoConnect: true,
  authError: null,
  connectionState: "disconnected",
  error: null
}

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setAutoConnect(state, action: PayloadAction<boolean>) {
      state.autoConnect = action.payload
    },
    setAuthError(state, action: PayloadAction<AuthError | null>) {
      state.authError = action.payload
    },
    setConnectionState(state, action: PayloadAction<ConnectionState>) {
      state.connectionState = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    }
  }
})

export const { setAutoConnect, setAuthError, setConnectionState, setError } = socketSlice.actions

export default socketSlice.reducer

export const initAuthenticationAction = createAction("socket/init", function prepare(token: string) {
  return {
    payload: {
      token
    }
  }
})

export const disconnectSocketAction = createAction("socket/disconnect")

export const sendMessage = <Message extends keyof IPC.MessageType>(
  messageType: Message,
  ...args: IPC.MessageArgs<Message>
): AppThunk<Promise<IPC.MessageReturnType<Message>>> => (dispatch, getState) => {
  return new Promise<IPC.MessageReturnType<Message>>((resolve, reject) => {
    dispatch(sendMessageAction({ successCallback: resolve, errorCallback: reject, messageType, args }))
  })
}

export const sendMessageAction = createAction("socket/sendMessage", function prepare<
  Message extends keyof IPC.MessageType
>(payload: {
  successCallback: (value?: IPC.MessageReturnType<Message>) => void
  errorCallback: (reason?: any) => void
  messageType: Message
  args: any
}) {
  return {
    payload
  }
})

export const subscribeToMessagesAction = createAction("socket/subscribe", function prepare<
  Message extends keyof IPC.MessageType
>(payload: { messageType: Message; callback: (message: IPC.MessageReturnType<Message>) => void }) {
  return {
    payload
  }
})

export const unsubscribeFromMessagesAction = createAction("socket/unsubscribe", function prepare(payload: {
  callback: (message: any) => void
}) {
  return {
    payload
  }
})

export const subscribeToMessages = <Message extends keyof IPC.MessageType>(
  messageType: Message,
  callback: (message: IPC.MessageReturnType<Message>) => void
): AppThunk<UnsubscribeFn> => (dispatch, getState) => {
  dispatch(subscribeToMessagesAction({ messageType, callback }))

  return () => dispatch(unsubscribeFromMessagesAction({ callback }))
}

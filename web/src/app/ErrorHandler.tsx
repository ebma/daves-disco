import React from "react"
import { NotificationsContext } from "../context/notifications"
import { setError as setSocketError } from "../redux/socketSlice"
import { setError as setUserError } from "../redux/userSlice"
import { RootState } from "./rootReducer"
import { AppDispatch, useAppDispatch, useAppSelector } from "./store";

function ErrorHandler() {
  const dispatch: AppDispatch = useAppDispatch()
  const rootState = useAppSelector((state: RootState) => state)

  const { showError } = React.useContext(NotificationsContext)

  React.useEffect(() => {
    if (rootState.socket.error) {
      showError(rootState.socket.error)
      dispatch(setSocketError(null))
    }

    if (rootState.user.error) {
      showError(rootState.user.error)
      dispatch(setUserError(null))
    }
  }, [dispatch, rootState.socket.error, rootState.user.error, showError])

  return <></>
}

export default ErrorHandler

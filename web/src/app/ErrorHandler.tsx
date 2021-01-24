import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { NotificationsContext } from "../context/notifications"
import { setError as setSocketError } from "../redux/socketSlice"
import { setError as setUserError } from "../redux/userSlice"
import { RootState } from "./rootReducer"
import { AppDispatch } from "./store"

function ErrorHandler() {
  const dispatch: AppDispatch = useDispatch()
  const rootState = useSelector((state: RootState) => state)

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

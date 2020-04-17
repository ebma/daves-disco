import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "./rootReducer"
import { NotificationsContext } from "../context/notifications"

function ErrorHandler() {
  const rootState = useSelector((state: RootState) => state)

  const { showError } = React.useContext(NotificationsContext)

  React.useEffect(() => {
    if (rootState.guilds.error) {
      showError(rootState.guilds.error)
    }
    if (rootState.player.error) {
      showError(rootState.player.error)
    }
    if (rootState.playlists.error) {
      showError(rootState.playlists.error)
    }
    if (rootState.socket.error) {
      showError(rootState.socket.error)
    }
    if (rootState.tracks.error) {
      showError(rootState.tracks.error)
    }
    if (rootState.user.error) {
      showError(rootState.user.error)
    }
  }, [
    rootState.guilds.error,
    rootState.player.error,
    rootState.playlists.error,
    rootState.socket.error,
    rootState.tracks.error,
    rootState.user.error,
    showError
  ])

  return <></>
}

export default ErrorHandler

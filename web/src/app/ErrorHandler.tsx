import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "./rootReducer"
import { NotificationsContext } from "../context/notifications"
import { setError as setGuildsError } from "../redux/guildsSlice"
import { setError as setPlayerError } from "../redux/playerSlice"
import { setError as setPlaylistsError } from "../redux/playlistsSlice"
import { setError as setSocketError } from "../redux/socketSlice"
import { setError as setTracksError } from "../redux/tracksSlice"
import { setError as setUserError } from "../redux/userSlice"
import { AppDispatch } from "./store"

function ErrorHandler() {
  const dispatch: AppDispatch = useDispatch()
  const rootState = useSelector((state: RootState) => state)

  const { showError } = React.useContext(NotificationsContext)

  React.useEffect(() => {
    if (rootState.guilds.error) {
      showError(rootState.guilds.error)
      dispatch(setGuildsError(null))
    }
    if (rootState.player.error) {
      showError(rootState.player.error)
      dispatch(setPlayerError(null))
    }
    if (rootState.playlists.error) {
      showError(rootState.playlists.error)
      dispatch(setPlaylistsError(null))
    }
    if (rootState.socket.error) {
      showError(rootState.socket.error)
      dispatch(setSocketError(null))
    }
    if (rootState.tracks.error) {
      showError(rootState.tracks.error)
      dispatch(setTracksError(null))
    }
    if (rootState.user.error) {
      showError(rootState.user.error)
      dispatch(setUserError(null))
    }
  }, [
    dispatch,
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

import { ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { HashRouter as Router } from "react-router-dom"
import { fetchGuilds } from "../redux/guildsSlice"
import Dashboard from "../components/Dashboard/Dashboard"
import NotificationContainer from "../components/Notification/NotificationContainer"
import { ColorSchemeContext, ColorSchemeProvider } from "../context/colorScheme"
import { NotificationsProvider } from "../context/notifications"
import { fetchPlayerState, subscribePlayerState } from "../redux/playerSlice"
import { fetchPlaylists, subscribePlaylists } from "../redux/playlistsSlice"
import { fetchItems, subscribeItems } from "../redux/soundboardsSlice"
import { fetchTracks, subscribeTracks } from "../redux/tracksSlice"
import createTheme from "../theme"
import ErrorHandler from "./ErrorHandler"
import { RootState } from "./rootReducer"
import { AppDispatch } from "./store"

function MaterialThemeProvider(props: { children: React.ReactNode }) {
  const { colorScheme } = React.useContext(ColorSchemeContext)

  const prefersDarkMode = colorScheme === "dark"
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode])

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

function App() {
  const dispatch: AppDispatch = useDispatch()

  const { connectionState } = useSelector((state: RootState) => state.socket)

  React.useEffect(() => {
    if (connectionState === "connected") {
      dispatch(fetchPlayerState())
    }

    const unsubscribe = dispatch(subscribePlayerState())

    return unsubscribe
  }, [connectionState, dispatch])

  React.useEffect(() => {
    const fetchRecents = async () => {
      dispatch(fetchPlaylists())
      dispatch(fetchTracks())
      dispatch(fetchItems())
    }

    const unsubscribePlaylists = dispatch(subscribePlaylists())
    const unsubscribeTracks = dispatch(subscribeTracks())
    const unsubscribeItems = dispatch(subscribeItems())

    fetchRecents()

    return () => {
      unsubscribePlaylists()
      unsubscribeTracks()
      unsubscribeItems()
    }
  }, [dispatch])

  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchGuilds())
    }, 20000)
    dispatch(fetchGuilds())
    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <ColorSchemeProvider>
      <MaterialThemeProvider>
        <NotificationsProvider>
          <Router>
            <Dashboard />
          </Router>
          <ErrorHandler />
          <NotificationContainer />
        </NotificationsProvider>
      </MaterialThemeProvider>
    </ColorSchemeProvider>
  )
}

export default App

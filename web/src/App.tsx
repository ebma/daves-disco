import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import IndexPage from "./pages/IndexPage"
import { SocketProvider } from "./context/socket"
import NotificationContainer from "./components/Notification/NotificationContainer"
import { NotificationsProvider } from "./context/notifications"
import createTheme from "./theme"
import useMediaQuery from "@material-ui/core/useMediaQuery"

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <NotificationsProvider>
        <SocketProvider>
          <IndexPage />
          <NotificationContainer />
        </SocketProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}

export default App

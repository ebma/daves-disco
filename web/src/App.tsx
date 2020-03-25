import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import IndexPage from "./pages/IndexPage"
import { SocketProvider } from "./context/socket"
import NotificationContainer from "./components/Notification/NotificationContainer"
import { NotificationsProvider } from "./context/notifications"
import createTheme from "./theme"
import { ColorSchemeContext, ColorSchemeProvider } from "./context/colorScheme"

function MaterialThemeProvider(props: { children: React.ReactNode }) {
  const { colorScheme } = React.useContext(ColorSchemeContext)

  const prefersDarkMode = colorScheme === "dark"
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode])

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

function App() {
  return (
    <ColorSchemeProvider>
      <MaterialThemeProvider>
        <NotificationsProvider>
          <SocketProvider>
            <IndexPage />
            <NotificationContainer />
          </SocketProvider>
        </NotificationsProvider>
      </MaterialThemeProvider>
    </ColorSchemeProvider>
  )
}

export default App

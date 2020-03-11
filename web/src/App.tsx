import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import Footer from "./components/Footer"
import ControlPage from "./pages/ControlPage"
import { SocketProvider } from "./context/socket"
import NotificationContainer from "./components/Notification/NotificationContainer"
import { NotificationsProvider } from "./context/notifications"
import theme, { backgroundColor } from "./theme"
import Box from "@material-ui/core/Box"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <NotificationsProvider>
        <SocketProvider>
          <Box style={{ background: backgroundColor.dark, margin: 0, padding: 0 }}>
            <ControlPage />
            <Footer />
            <NotificationContainer />
          </Box>
        </SocketProvider>
      </NotificationsProvider>
    </ThemeProvider>
  )
}

export default App

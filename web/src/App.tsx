import React from "react"
import { ThemeProvider } from "@material-ui/core/styles"
import IndexPage from "./pages/IndexPage"
import { SocketProvider } from "./context/socket"
import NotificationContainer from "./components/Notification/NotificationContainer"
import { NotificationsProvider } from "./context/notifications"
import theme from "./theme"

function App() {
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

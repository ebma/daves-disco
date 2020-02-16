import React from "react"
import Footer from "./components/Footer"
import ControlPage from "./pages/ControlPage"
import { SocketProvider } from "./context/socket"
import NotificationContainer from "./components/Notification/NotificationContainer"
import { NotificationsProvider } from "./context/notifications"

function App() {
  return (
    <NotificationsProvider>
      <SocketProvider>
        <ControlPage />
        <Footer />
        <NotificationContainer />
      </SocketProvider>
    </NotificationsProvider>
  )
}

export default App

import React from "react"
import Footer from "./components/Footer"
import ControlPage from "./pages/ControlPage"
import { SocketProvider } from "./context/socket"

function App() {

  return (
    <SocketProvider>
      <ControlPage />
      <Footer />
    </SocketProvider>
  )
}

export default App

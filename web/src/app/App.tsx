import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { HashRouter as Router } from "react-router-dom"
import Dashboard from "../components/Dashboard/Dashboard"
import LoginDialog from "../components/Login/LoginDialog"
import NotificationContainer from "../components/Notification/NotificationContainer"
import { useTokenStorage } from "../hooks/tokenStorage"
import { initAuthenticationAction } from "../redux/socketSlice"
import { useGetGuildsQuery } from "../services/graphql/graphql"
import ErrorHandler from "./ErrorHandler"
import { RootState } from "./rootReducer"
import { AppDispatch } from "./store"

function App() {
  const { authError, autoConnect, connectionState } = useSelector((state: RootState) => state.socket)
  const { user } = useSelector((state: RootState) => state.user)

  const [initialized, setInitialized] = React.useState(false)

  const tokenStorage = useTokenStorage()
  const dispatch: AppDispatch = useDispatch()

  const { loading, data } = useGetGuildsQuery({ pollInterval: 5000 })

  React.useEffect(() => {
    // auto-login user
    if (
      autoConnect &&
      authError !== "jwt-expired" &&
      connectionState === "connected" &&
      user &&
      data?.getGuilds?.find(g => g.id === user.guildID && g.members?.find(m => m.id === user.id))
    ) {
      const token = tokenStorage.getTokenForUser(user.guildID, user.id)
      if (token) {
        dispatch(initAuthenticationAction(token.jwt))
      }
    }

    if (!loading) {
      // add timeout to wait for socket connection
      setTimeout(() => {
        setInitialized(true)
      }, 1000)
    }
  }, [autoConnect, authError, connectionState, data, dispatch, loading, tokenStorage, user])

  return (
    <>
      <Router>
        <LoginDialog open={initialized && connectionState !== "authenticated"} onClose={() => undefined} />
        {user && connectionState === "authenticated" && <Dashboard user={user} />}
      </Router>
      <ErrorHandler />
      <NotificationContainer />
    </>
  )
}

export default App

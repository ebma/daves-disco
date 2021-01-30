import { ApolloProvider } from "@apollo/client"
import { ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { useSelector } from "react-redux"
import { HashRouter as Router } from "react-router-dom"
import Dashboard from "../components/Dashboard/Dashboard"
import LoginDialog from "../components/Login/LoginDialog"
import NotificationContainer from "../components/Notification/NotificationContainer"
import { ColorSchemeContext, ColorSchemeProvider } from "../context/colorScheme"
import { NotificationsProvider } from "../context/notifications"
import apolloClient from "../services/graphql/apollo-client"
import createTheme from "../theme"
import ErrorHandler from "./ErrorHandler"
import { RootState } from "./rootReducer"

function MaterialThemeProvider(props: { children: React.ReactNode }) {
  const { colorScheme } = React.useContext(ColorSchemeContext)

  const prefersDarkMode = colorScheme === "dark"
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode])

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

function App() {
  const { connectionState } = useSelector((state: RootState) => state.socket)
  const { user } = useSelector((state: RootState) => state.user)

  return (
    <ColorSchemeProvider>
      <MaterialThemeProvider>
        <ApolloProvider client={apolloClient}>
          <NotificationsProvider>
            <Router>
              <LoginDialog open={connectionState !== "authenticated"} onClose={() => undefined} />
              {user && connectionState === "authenticated" && <Dashboard user={user} />}
            </Router>
            <ErrorHandler />
            <NotificationContainer />
          </NotificationsProvider>
        </ApolloProvider>
      </MaterialThemeProvider>
    </ColorSchemeProvider>
  )
}

export default App

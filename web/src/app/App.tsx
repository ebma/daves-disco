import { ApolloProvider } from "@apollo/client"
import { ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { HashRouter as Router } from "react-router-dom"
import Dashboard from "../components/Dashboard/Dashboard"
import NotificationContainer from "../components/Notification/NotificationContainer"
import { ColorSchemeContext, ColorSchemeProvider } from "../context/colorScheme"
import { NotificationsProvider } from "../context/notifications"
import apolloClient from "../services/graphql/apollo-client"
import createTheme from "../theme"
import ErrorHandler from "./ErrorHandler"

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
        <ApolloProvider client={apolloClient}>
          <NotificationsProvider>
            <Router>
              <Dashboard />
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

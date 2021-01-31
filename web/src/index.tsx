import { ApolloProvider } from "@apollo/client"
import { ThemeProvider } from "@material-ui/core/styles"
import * as Sentry from "@sentry/browser"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import store from "./app/store"
import { ColorSchemeContext, ColorSchemeProvider } from "./context/colorScheme"
import { NotificationsProvider } from "./context/notifications"
import "./index.css"
import apolloClient from "./services/graphql/apollo-client"
import createTheme from "./theme"

Sentry.init({ dsn: "https://19a1181bedbf42d3bcdeed169eaf5af9@o394107.ingest.sentry.io/5243849" })

function MaterialThemeProvider(props: { children: React.ReactNode }) {
  const { colorScheme } = React.useContext(ColorSchemeContext)

  const prefersDarkMode = colorScheme === "dark"
  const theme = React.useMemo(() => createTheme(prefersDarkMode), [prefersDarkMode])

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
}

const render = () => {
  const App = require("./app/App").default

  ReactDOM.render(
    <Provider store={store}>
      <ColorSchemeProvider>
        <MaterialThemeProvider>
          <ApolloProvider client={apolloClient}>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </ApolloProvider>
        </MaterialThemeProvider>
      </ColorSchemeProvider>
    </Provider>,
    document.getElementById("root")
  )
}

render()

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", render)
}

import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import * as Sentry from "@sentry/browser"
import "./index.css"
import store from "./app/store"

Sentry.init({ dsn: "https://19a1181bedbf42d3bcdeed169eaf5af9@o394107.ingest.sentry.io/5243849" })

const render = () => {
  const App = require("./app/App").default

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  )
}

render()

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", render)
}

import logger from "redux-logger"
import { Middleware } from "@reduxjs/toolkit"

let loggerImpl: Middleware

if (process.env.NODE_ENV === "development" && process.env.LOGGER === "true") {
  loggerImpl = logger
} else {
  loggerImpl = store => next => action => next(action)
}

export default loggerImpl

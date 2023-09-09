import { configureStore, ThunkAction, Action, getDefaultMiddleware } from "@reduxjs/toolkit"
import logger from "../redux/middleware/logger"
import socket from "../redux/middleware/socket"
import rootReducer, { RootState } from "./rootReducer"

const middleware = getDefaultMiddleware()
middleware.pop()
middleware.push(socket)
middleware.push(...getDefaultMiddleware())
middleware.push(logger)

const store = configureStore({
  reducer: rootReducer,
  middleware
})

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./rootReducer", () => {
    const newRootReducer = require("./rootReducer").default
    store.replaceReducer(newRootReducer)
  })
}

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export default store

import cors from "cors"
import express from "express"
require("express-async-errors")
import playlistsRouter from "./controllers/playlists"
import tracksRouter from "./controllers/tracks"
import { createLoginRouter } from "./controllers/login"
import middleware from "./middleware"
import { connect } from "../db/connection"
import config from "../utils/config"
import { MyClient } from "../bot/MyClient"

connect(config.MONGODB_URI)

export function initApp(client: MyClient) {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use("/api/playlists", playlistsRouter)
  app.use("/api/tracks", tracksRouter)

  const loginRouter = createLoginRouter(client)
  app.use("/api/login", loginRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  return app
}

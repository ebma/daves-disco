import { ApolloServer } from "apollo-server-express"
import cors from "cors"
import express from "express"
import { MyClient } from "../bot/MyClient"
import { connect } from "../db/connection"
import config from "../utils/config"
import { createLoginRouter } from "./controllers/login"
import youtubeRouter from "./controllers/youtube"
import middleware from "./middleware"
import { createSchema } from "./schema/schema"
require("express-async-errors")

connect(config.MONGODB_URI)

export function initApp(client: MyClient) {
  const app = express()

  const schema = createSchema(client)

  const apolloServer = new ApolloServer({ schema })
  apolloServer.applyMiddleware({ app })

  const loginRouter = createLoginRouter(client)

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use("/api/login", loginRouter)
  app.use("/api/youtube", youtubeRouter)

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  return app
}

import { ApolloServer } from "@apollo/server"
import cors from "cors"
import express from "express"
import { connect } from "../db/connection"
import config from "../utils/config"
import { createLoginRouter } from "./controllers/login"
import youtubeRouter from "./controllers/youtube"
import middleware from "./middleware"
import { createSchema } from "./schema/schema"
import { expressMiddleware } from "@apollo/server/express4"
import pkg from "body-parser"
import { Client } from "discord.js"

const { json } = pkg
require("express-async-errors")

connect(config.MONGODB_URI)

export async function initApp(client: Client) {
  const app = express()

  const schema = createSchema(client)

  const apolloServer = new ApolloServer({ schema, cache: "bounded" })
  await apolloServer.start()

  app.use("/graphql", cors<cors.CorsRequest>(), json(), expressMiddleware(apolloServer, {}))

  const loginRouter = createLoginRouter(client)

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)

  app.use("/api/login", loginRouter)
  app.use("/api/youtube", youtubeRouter)

  app.use("/", (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8")
    res.end("Service up and running.")
  })

  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)

  return app
}

import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import config from "../utils/config"
import logger from "../utils/logger"

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  logger.info("Method:", request.method)
  logger.info("Path:  ", request.path)
  logger.info("Body:  ", request.body)
  logger.info("---")
  next()
}

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
  logger.error(error.message)

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "invalid token" })
  }

  next(error)
}

const getTokenFrom = (request: Request) => {
  const authorization = request.get("Authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

const authHandler = (request: Request, response: Response, next: NextFunction) => {
  const token = getTokenFrom(request)
  try {
    const decodedToken = jwt.verify(token, config.SECRET) as DecodedToken
    if (!token || !decodedToken.userID) {
      response.status(401).json({ error: "Authentication required" })
      throw Error("Authorization failed: Invalid token!")
    }
  } catch (error) {
    next(error)
  }

  next()
}

const middleware = {
  authHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler
}

export default middleware

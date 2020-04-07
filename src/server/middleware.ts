import logger from "../utils/logger"
import { Request, Response, NextFunction } from "express"

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

const middleware = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}

export default middleware

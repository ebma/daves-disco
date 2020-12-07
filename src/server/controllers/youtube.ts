import { Request, Response, Router } from "express"
import Youtube from "../../libs/Youtube"
import middleware from "../middleware"

const youtubeRouter = Router()

youtubeRouter.get("/", middleware.authHandler, async (request: Request, response: Response) => {
  const query = request.query.q as string
  if (!query) {
    response.status(400).json({ error: "Query parameter missing" })
  } else {
    const foundTracks = await Youtube.fastSearch(query, 5)
    response.json(foundTracks)
  }
})

export default youtubeRouter

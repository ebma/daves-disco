import { Router } from "express"
import Youtube from "../../libs/Youtube"

const youtubeRouter = Router()

youtubeRouter.get("/", async (request, response) => {
  const query = request.query.q
  if (!query) {
    response.status(400).json({ error: "Query parameter missing" })
  } else {
    const foundTracks = await Youtube.fastSearch(query, 5)
    response.json(foundTracks)
  }
})

export default youtubeRouter

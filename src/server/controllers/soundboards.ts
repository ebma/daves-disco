import { Request, Router } from "express"
import jwt from "jsonwebtoken"
import config from "../../utils/config"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"
import SoundboardItem from "../../db/models/soundboard-item"

const router = Router()

interface SoundboardRequest extends Request {
  body: SoundboardItemModel
}

const getTokenFrom = (request: Request) => {
  const authorization = request.get("Authorization")
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7)
  }
  return null
}

router.get("/", async (request: SoundboardRequest, response) => {
  const guild = request.query.guild || undefined

  const query = SoundboardItem.find()
  if (guild) {
    query.where("guild").equals(guild)
  }

  const soundboardItems = await query.exec()

  response.json(soundboardItems.map(item => item.toJSON()))
})

router.post("/", async (request: SoundboardRequest, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, config.SECRET) as DecodedToken
  if (!token || !decodedToken.userID) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  const item = new SoundboardItem({
    guild: body.guild,
    name: body.name,
    source: body.source
  })

  try {
    const savedItem = await item.save()
    response.json(savedItem.toJSON())
  } catch (error) {
    response.status(400).json({ error: "Could not save item" })
  }
})

router.get("/:id", async (request: SoundboardRequest, response) => {
  const soundboardItem = await SoundboardItem.findById(request.params.id)
  if (soundboardItem) {
    response.json(soundboardItem.toJSON())
  } else {
    response.status(404).end()
  }
})

router.put("/:id", (request: SoundboardRequest, response, next) => {
  const body = request.body

  const item = {
    guild: body.guild,
    name: body.name,
    source: body.source
  }

  SoundboardItem.findByIdAndUpdate(request.params.id, item, { upsert: true })
    .then(updatedItem => {
      response.json(updatedItem.toJSON())
      WebSocketHandler.sendMessage(Messages.SoundboardItemsChange, item.guild)
    })
    .catch(error => next(error))
})

router.delete("/:id", async (request: SoundboardRequest, response) => {
  await SoundboardItem.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

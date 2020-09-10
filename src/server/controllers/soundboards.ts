import { Request, Router, Response, NextFunction } from "express"
import WebSocketHandler from "../../socket/WebSocketHandler"
import { Messages } from "../../shared/ipc"
import SoundboardItem from "../../db/models/soundboard-item"
import middleware from "../middleware"

const router = Router()

interface SoundboardRequest extends Request {
  body: SoundboardItemModel
}

router.get("/", middleware.authHandler, async (request: SoundboardRequest, response: Response) => {
  const guild = request.query.guild || undefined

  const query = SoundboardItem.find()
  if (guild) {
    query.where("guild").equals(guild)
  }

  const soundboardItems = await query.exec()

  response.json(soundboardItems.map(item => item.toJSON()))
})

router.post("/", middleware.authHandler, async (request: SoundboardRequest, response: Response) => {
  const body = request.body

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

router.get("/:id", middleware.authHandler, async (request: SoundboardRequest, response: Response) => {
  const soundboardItem = await SoundboardItem.findById(request.params.id)
  if (soundboardItem) {
    response.json(soundboardItem.toJSON())
  } else {
    response.status(404).end()
  }
})

router.put("/:id", middleware.authHandler, (request: SoundboardRequest, response: Response, next: NextFunction) => {
  const body = request.body

  const item = {
    guild: body.guild,
    name: body.name,
    source: body.source
  }

  SoundboardItem.findByIdAndUpdate(request.params.id, item, { upsert: true })
    .then(updatedItem => {
      response.json(updatedItem.toJSON())
      WebSocketHandler.sendMessage(Messages.SoundboardItemsChange)
    })
    .catch(error => next(error))
})

router.delete("/:id", middleware.authHandler, async (request: SoundboardRequest, response: Response) => {
  await SoundboardItem.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

export default router

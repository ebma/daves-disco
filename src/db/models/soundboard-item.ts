import mongoose, { Schema, Document } from "mongoose"

export type ISoundboardItem = Document & SoundboardItemModel

const SoundboardItemSchema = new Schema({
  guild: { type: String, required: true },
  source: { type: String, required: true },
  name: { type: String, required: true }
}).index({ guild: 1, name: 1 }, { unique: true })

SoundboardItemSchema.set("toJSON", {
  transform: (_: any, returnedObject: any) => {
    delete returnedObject.__v
  }
})

const SoundboardItem = mongoose.model<ISoundboardItem>("SoundboardItem", SoundboardItemSchema)

export default SoundboardItem

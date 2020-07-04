import mongoose, { Schema, Document } from "mongoose"

export type ISoundboardItem = Document & SoundboardItemModel

const SoundboardItemSchema: Schema = new Schema<SoundboardItemModel>({
  id: { type: String, required: true },
  guild: { type: String, required: true },
  source: { type: String, required: true },
  name: { type: String, required: true }
}).index({ id: 1, guild: 1 }, { unique: true })

SoundboardItemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const SoundboardItem = mongoose.model<ISoundboardItem>("SoundboardItem", SoundboardItemSchema)

export default SoundboardItem

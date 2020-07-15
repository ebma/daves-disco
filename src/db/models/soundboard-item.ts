import mongoose, { Schema, Document } from "mongoose"

export type ISoundboardItem = Document & SoundboardItemModel

const SoundboardItemSchema: Schema = new Schema<SoundboardItemModel>({
  guild: { type: String, required: true },
  source: { type: String, required: true },
  name: { type: String, required: true }
}).index({ guild: 1, name: 1 }, { unique: true })

SoundboardItemSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const SoundboardItem = mongoose.model<ISoundboardItem>("SoundboardItem", SoundboardItemSchema)

export default SoundboardItem

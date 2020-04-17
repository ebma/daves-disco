import mongoose, { Schema, Document } from "mongoose"

export type ITrack = Document & TrackModel

const TrackSchema: Schema = new Schema<TrackModel>({
  artists: { type: String, required: false },
  id: { type: String, required: true },
  favourite: { default: false, type: Boolean, required: false },
  guild: { type: String, required: true },
  lastTouchedAt: { type: Date, default: Date.now, required: false },
  source: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: {
    small: { type: String, required: false },
    medium: { type: String, required: false },
    large: { type: String, required: false }
  },
  touchedByUser: { type: Boolean, default: false },
  url: { type: String, required: false }
}).index({ id: 1, guild: 1 }, { unique: true })

TrackSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Track = mongoose.model<ITrack>("Track", TrackSchema)

export default Track

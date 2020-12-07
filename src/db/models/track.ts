import mongoose, { Schema, Document } from "mongoose"

export type ITrack = Document & TrackModel

const TrackSchema = new Schema({
  artists: { type: String, required: false },
  favourite: [{ guild: String, favourite: Boolean }],
  lastTouchedAt: [{ guild: String, date: String }],
  source: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: {
    small: { type: String, required: false },
    medium: { type: String, required: false },
    large: { type: String, required: false }
  },
  touchedByUser: [{ guild: String, touched: Boolean }],
  url: { type: String, required: false }
})

TrackSchema.set("toJSON", {
  transform: (document: any, returnedObject: any) => {
    delete returnedObject.__v
    returnedObject.id = document._id
  }
})

const Track = mongoose.model<ITrack>("Track", TrackSchema)

export default Track

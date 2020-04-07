import mongoose, { Schema, Document } from "mongoose"

export type IPlaylist = Document & PlaylistModel

const PlaylistSchema: Schema<PlaylistModel> = new Schema({
  id: { type: String, required: true },
  favourite: { type: Boolean, default: false, required: false },
  guild: { type: String, required: true },
  lastTouchedAt: { type: Date, default: Date.now, required: false },
  name: { type: String, required: true },
  owner: { type: String, required: false },
  source: { type: String, required: true },
  thumbnail: {
    small: { type: String, required: false },
    medium: { type: String, required: false },
    large: { type: String, required: false }
  },
  uri: { type: String, required: false },
  url: { type: String, required: false }
}).index({ id: 1, guild: 1 }, { unique: true })

PlaylistSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema)

export default Playlist

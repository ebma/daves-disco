import mongoose, { Schema, Document } from "mongoose"

export type IPlaylist = Document & PlaylistModel

const PlaylistSchema = new Schema({
  id: { type: String, required: true, unique: true },
  favourite: [{ guild: String, favourite: Boolean }],
  lastTouchedAt: [{ guild: String, date: String }],
  name: { type: String, required: true },
  owner: { type: String, required: false },
  source: { type: String, required: true },
  tracks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Track",
      required: true,
      default: []
    }
  ],
  thumbnail: {
    small: { type: String, required: false },
    medium: { type: String, required: false },
    large: { type: String, required: false }
  },
  uri: { type: String, required: false },
  url: { type: String, required: false }
})

PlaylistSchema.set("toJSON", {
  transform: (_: any, returnedObject: any) => {
    delete returnedObject.__v
  }
})

const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema)

export default Playlist

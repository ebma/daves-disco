import mongoose, { Schema, Document } from "mongoose"

export type IPlaylist = Document & PlaylistModel

const PlaylistSchema: Schema<PlaylistModel> = new Schema({
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
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema)

export default Playlist

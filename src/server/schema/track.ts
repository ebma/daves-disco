import { composeMongoose } from "graphql-compose-mongoose"
import Track from "../../db/models/track"

const TrackTC = composeMongoose(Track, {})
TrackTC.addResolver({
  name: "trackRecents",
  args: { guild: "String", limit: "Int" },
  type: TrackTC.NonNull.List.NonNull,
  resolve: async (data: any) => {
    const { guild, limit } = data.args
    const query = Track.find()
    if (guild) {
      query.where("lastTouchedAt.guild").equals(guild)
    }
    if (limit) {
      query.limit(Number(limit))
    }
    query.sort({ lastTouchedAt: -1 })

    const tracks = await query.exec()
    return tracks.map(track => track.toJSON())
  }
})

export default TrackTC

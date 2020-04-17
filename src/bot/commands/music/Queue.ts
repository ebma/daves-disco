import { createEmbedForTracks } from "../../../utils/embeds"
import { MusicCommand } from "./MusicCommand"
import Track from "../../../db/models/track"

class QueueCommand extends MusicCommand {
  constructor() {
    super("queue", {
      aliases: ["queue", "list", "next-songs"],
      channel: "guild"
    })
  }

  async execute() {
    const tracks = await Track.find({ _id: { $in: this.musicPlayer.remainingTracks } })

    if (tracks.length === 0) {
      return this.sendMessageToChannel("I've nothing to play... :flushed:")
    } else {
      const trackEmbed = createEmbedForTracks(tracks)
      trackEmbed.setTitle("These are my next tracks:")
      return this.sendMessageToChannel(trackEmbed)
    }
  }
}

export default QueueCommand

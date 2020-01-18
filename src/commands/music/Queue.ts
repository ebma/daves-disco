import { createEmbedForTracks } from "../../libs/util/embeds"
import { MusicCommand } from "./MusicCommand"

class QueueCommand extends MusicCommand {
  constructor() {
    super("queue", {
      aliases: ["queue", "list", "next-songs"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    const tracks = this.musicPlayer.remainingTracks

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

import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"
import { createEmbedForTracks } from "../../libs/util/embeds"
import { Track } from "../../types/exported-types"

class QueueCommand extends Command {
  constructor() {
    super("queue", {
      aliases: ["queue", "list", "next-songs"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    const tracks: Track[] = []
    musicPlayer.queuedTracks.forEach(track => {
      tracks.push(track)
    })

    if (tracks.length === 0) {
      return message.reply("I've nothing to play... :flushed:")
    } else {
      const trackEmbed = createEmbedForTracks(tracks)
      trackEmbed.setTitle("These are my next tracks:")
      return message.channel.send(trackEmbed)
    }
  }
}

export default QueueCommand

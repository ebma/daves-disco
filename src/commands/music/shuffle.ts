import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"
import { createEmbedForTracks } from "../../libs/util/embeds"

class ShuffleCommand extends Command {
  constructor() {
    super("shuffle", {
      aliases: ["shuffle", "mix"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (musicPlayer.queue.size() === 0) {
      return message.reply("There's nothing to shuffle as the queue is empty... :shrug:")
    }

    musicPlayer.shuffle()

    return message.reply("I spiced it up a bit! :fire:")
  }
}

export default ShuffleCommand

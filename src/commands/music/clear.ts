import { Message } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

class ClearCommand extends Command {
  constructor() {
    super("clear", {
      aliases: ["clear", "shut up", "stop"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    musicPlayer.clear()
    return message.reply("OK I'll stop playing more :fire: songs")
  }
}

export default ClearCommand

import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"

class ResetCommand extends Command {
  constructor() {
    super("reset", {
      aliases: ["reset"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    try {
        const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)
        musicPlayer.clear()
        musicPlayer.close("Reset")
        MusicPlayerManager.removePlayerFor(message.guild.id)
        return message.reply("Successfully resetted the music player.")
    } catch(error) {
        return message.reply(`Something went wrong... ${error}`)
    }
  }
}

export default ResetCommand

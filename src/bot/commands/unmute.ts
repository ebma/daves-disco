import { Command } from "discord-akairo"
import { Message } from "discord.js"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

class UnmuteCommand extends Command {
  constructor() {
    super("unmute", {
      aliases: ["unmute"],
      channel: "guild"
    })
  }

  exec(message: Message, args: any) {
    const member = message.member
    const musicPlayer = MusicPlayerManager.getPlayerFor(member.guild.id)

    if (musicPlayer) {
      musicPlayer.unmuteModerator()
      return message.reply("Get ready for live music!")
    }
  }
}

export default UnmuteCommand

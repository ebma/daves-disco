import { Command } from "discord-akairo"
import { Message } from "discord.js"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

class MuteCommand extends Command {
  constructor() {
    super("mute", {
      aliases: ["mute"],
      channel: "guild"
    })
  }

  exec(message: Message, args: any) {
    const member = message.member
    const musicPlayer = MusicPlayerManager.getPlayerFor(member.guild.id)

    if (musicPlayer) {
      musicPlayer.muteModerator()
      return message.reply("Muted my fancy comments...")
    }
  }
}

export default MuteCommand

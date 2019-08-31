import { Message } from "discord.js"
import { Command } from "discord-akairo"

class BanCommand extends Command {
  constructor() {
    super("ban", {
      aliases: ["ban"],
      args: [
        {
          id: "member",
          type: "member"
        }
      ],
      clientPermissions: ["BAN_MEMBERS"],
      userPermissions: ["BAN_MEMBERS"],
      channelRestriction: "guild"
    })
  }

  exec(message: Message, args: any) {
    if (!args.member) {
      return message.reply("No member found with that name.")
    }

    return args.member.ban().then(() => {
      return message.reply(`${args.member} was banned!`)
    })
  }
}

export default BanCommand

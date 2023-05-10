import { Message } from "discord.js"
import { Command } from "discord-akairo"

class BanCommand extends Command {
  constructor() {
    super("ban", {
      aliases: ["ban"],
      args: [
        {
          id: "data",
          type: "member"
        }
      ],
      clientPermissions: ["BanMembers"],
      userPermissions: ["BanMembers"],
      channel: "guild"
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

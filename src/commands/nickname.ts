import { Message } from "discord.js"
import { Command } from "discord-akairo"

class NicknameCommand extends Command {
  constructor() {
    super("nickname", {
      aliases: ["nickname"],
      channelRestriction: "guild"
    })
  }

  exec(message: Message) {
    return message.reply(`Your nickname is ${message.member.nickname}.`)
  }
}

export default NicknameCommand

import { Message } from "discord.js"
import { Command } from "discord-akairo"

class GuiCommand extends Command {
  constructor() {
    super("gui", {
      aliases: ["gui", "name", "web", "interface"],
      channel: "guild"
    })
  }

  exec(message: Message, args: any) {
    return message.reply("you can find the web interface at https://discord-bot.marcel-ebert.de .")
  }
}

export default GuiCommand

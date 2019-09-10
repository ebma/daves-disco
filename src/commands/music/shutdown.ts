import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"

class ShutdownCommand extends Command {
  constructor() {
    super("shutdown", {
      aliases: ["shutdown", "force stop"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    message.reply("CY@")
    this.client.destroy()
    process.exit()
  }
}

export default ShutdownCommand

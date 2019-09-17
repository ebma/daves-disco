import { Message } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"

class ShutdownCommand extends Command {
  constructor() {
    super("restart", {
      aliases: ["restart"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    message.reply("I'll try to come back stronger.. :muscle:")

    setTimeout(() => {
      process.on("exit", () => {
          require("child_process").spawn(process.argv.shift(), process.argv, {
              cwd: process.cwd(),
              detached : true,
              stdio: "inherit"
          });
      });
      process.exit();
  }, 3000);
  }
}

export default ShutdownCommand

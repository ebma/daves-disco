import { Message } from "discord.js"
import { Listener, Command } from "discord-akairo"

class CommandBlockedListener extends Listener {
  constructor() {
    super("commandBlocked", {
      emitter: "commandHandler",
      eventName: "commandBlocked"
    })
  }

  exec(message: Message, command: Command, reason: string) {
    console.log(`${message.author.username} was blocked from using ${command.id} because of ${reason}!`)
    message.reply(`You were blocked from using ${command.id} because of ${reason}!`)
  }
}

export default CommandBlockedListener

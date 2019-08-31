import { Message } from "discord.js"
import { Command } from "discord-akairo"

const expressions: { [type: string]: string } = {
  ["digga"]: "# was?",
  ["wann"]: "um 15 Uhr :clock3:",
  ["warum"]: "darum! :smirk:"
}
class RegexCommand extends Command {
  constructor() {
    super("regex", {
      category: "random"
    })
  }

  trigger(message: Message) {
    const regex = new RegExp(Object.keys(expressions).join("|"), "i")
    return regex
    // return /digga$/i
  }

  exec(message: Message, match: any) {
    const matchingExpression = expressions[match[0].toLowerCase()]
    if (matchingExpression) {
      const reply = matchingExpression.replace("#", match)
      return message.reply(reply)
    } else {
      return Promise.resolve()
    }
  }
}

export default RegexCommand

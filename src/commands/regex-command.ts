import { Message } from "discord.js"
import { Command } from "discord-akairo"

import moment from "moment"
moment.locale()

const getTimeFromAMinuteAgo = () => {
  const oneMinuteAgo =  moment.now() - 60 * 1000
  return moment(oneMinuteAgo)
}

// the '#' will be replaced by the expression string
const expressions: { [type: string]: string } = {
  ["digga"]: "# was?",
  ["wann"]: `am ${getTimeFromAMinuteAgo().format("DD. MMMM YYYY")} um ${getTimeFromAMinuteAgo().format("HH:mm")} Uhr :spy:`,
  ["warum"]: "darum! :smirk:",
  ["wer"]: "na ich! :100:"
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

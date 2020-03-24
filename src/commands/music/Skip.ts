import _ from "lodash"
import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class SkipCommand extends MusicCommand {
  constructor() {
    super("skip", {
      aliases: ["skip"],
      args: [
        {
          id: "data",
          default: 1,
          type: (message, phrase) => {
            if (!phrase || _.isNaN(phrase)) return null
            const num = parseInt(phrase, 10)
            if (num < 1) return null
            return num
          },
          match: "content",
          prompt: {
            optional: true,
            retry: "You must skip at least 1 song.."
          }
        }
      ],
      channel: "guild"
    })
  }

  async execute(args: { data: any }) {
    const suppliedAmount = (args && args.data) || 1

    try {
      this.musicPlayer.skipForward(suppliedAmount)
      return this.sendMessageToChannel(`Skipped ${suppliedAmount} song${suppliedAmount > 1 ? "s" : ""}!`)
    } catch (error) {
      trackError(error, "SkipCommand.execute")
      this.sendMessageToChannel(`Could not skip songs: ${error}`)
    }
  }
}

export default SkipCommand

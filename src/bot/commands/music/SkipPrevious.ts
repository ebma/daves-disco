import _ from "lodash"
import { trackError } from "../../../utils/trackError"
import { MusicCommand } from "./MusicCommand"

class SkipPrevious extends MusicCommand {
  constructor() {
    super("skip-previous", {
      aliases: ["skip-previous"],
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
      this.musicPlayer.skipPrevious(suppliedAmount)
      return this.sendMessageToChannel(`Skipped ${suppliedAmount} song${suppliedAmount > 1 ? "s" : ""} backwards!`)
    } catch (error) {
      trackError(error, "SkipPrevious.execute")
      return this.sendMessageToChannel(`Could not skip to previous song: ${error}`)
    }
  }
}

export default SkipPrevious

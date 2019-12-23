import _ from "lodash"
import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class SkipPrevious extends MusicCommand {
  constructor() {
    super("skip-previous", {
      aliases: ["skip-previous"],
      args: [
        {
          id: "data",
          default: 1,
          type: word => {
            if (!word || _.isNaN(word)) return null
            const num = parseInt(word, 10)
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
      channelRestriction: "guild"
    })
  }

  async execute(args: { data: any }) {
    const suppliedAmount = (args && args.data) || 1

    try {
      this.musicPlayer.skipPrevious(suppliedAmount)
      return this.sendMessageToChannel(`Skipped ${suppliedAmount} songs backwards!`)
    } catch (error) {
      trackError(error, "SkipPrevious.execute")
      return this.sendMessageToChannel(`Could not skip to previous song: ${error}`)
    }
  }
}

export default SkipPrevious

import _ from "lodash"
import { MusicCommand } from "./MusicCommand"

class SkipCommand extends MusicCommand {
  constructor() {
    super("skip", {
      aliases: ["skip"],
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
    const queueSize = this.musicPlayer.queue.size()

    if (suppliedAmount === 1) {
      this.musicPlayer.skipForward()
      return this.sendMessageToChannel(`Skipped the current song!`)
    } else {
      const skippingSongsCount = suppliedAmount > queueSize ? queueSize : suppliedAmount

      this.musicPlayer.skipForward(skippingSongsCount)
      return this.sendMessageToChannel(`Skipped the current song + ${skippingSongsCount - 1} more!`)
    }
  }
}

export default SkipCommand

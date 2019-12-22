import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class SkipPrevious extends MusicCommand {
  constructor() {
    super("skip-previous", {
      aliases: ["skip-previous"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.skipPrevious()
    } catch (error) {
      trackError(error, "SkipPrevious.execute")
      return this.sendMessageToChannel(`Could not skip to previous song: ${error}`)
    }
  }
}

export default SkipPrevious

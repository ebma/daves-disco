import _ from "lodash"
import { MusicCommand } from "./MusicCommand"
import { trackError } from "../../shared/util/trackError"

class PauseCommand extends MusicCommand {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.pauseStream()
    } catch (error) {
      trackError(error)
      return this.sendMessageToChannel(`Could not pause: ${error}`)
    }
  }
}

export default PauseCommand

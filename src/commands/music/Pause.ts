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
    const error = await this.musicPlayer.pauseStream()
    if (error) {
      trackError(error)
      return this.sendMessageToChannel(`Could not pause: ${error}`)
    } else {
      return this.sendMessageToChannel("Pausing...")
    }
  }
}

export default PauseCommand

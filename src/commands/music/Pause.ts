import _ from "lodash"
import { MusicCommand } from "./MusicCommand"
import { trackError } from "../../shared/util/trackError"

class PauseCommand extends MusicCommand {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      channel: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.pauseStream()
    } catch (error) {
      trackError(error, "PauseCommand.execute")
      return this.sendMessageToChannel(`Could not pause: ${error ? error : "Unknown error"}`)
    }
  }
}

export default PauseCommand

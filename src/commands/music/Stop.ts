import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class StopCommand extends MusicCommand {
  constructor() {
    super("stop", {
      aliases: ["stop"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.stopStream()
    } catch (error) {
      trackError(error, "StopCommand.execute")
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default StopCommand

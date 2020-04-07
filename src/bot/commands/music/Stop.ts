import { trackError } from "../../../utils/trackError"
import { MusicCommand } from "./MusicCommand"

class StopCommand extends MusicCommand {
  constructor() {
    super("stop", {
      aliases: ["stop"],
      channel: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.destroy()
    } catch (error) {
      trackError(error, "StopCommand.execute")
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default StopCommand

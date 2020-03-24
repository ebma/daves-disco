import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class ResumeCommand extends MusicCommand {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      channel: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.resumeStream()
    } catch (error) {
      trackError(error, "ResumeCommand.execute")
      this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default ResumeCommand

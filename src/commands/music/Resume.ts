import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"

class ResumeCommand extends MusicCommand {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    const error = await this.musicPlayer.resumeStream()
    if (error) {
      trackError(error)
      this.sendMessageToChannel(`Something went wrong... ${error}`)
    } else {
      return this.sendMessageToChannel("Resuming...")
    }
  }
}

export default ResumeCommand

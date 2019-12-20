import { MusicCommand } from "./MusicCommand"

class ResetCommand extends MusicCommand {
  constructor() {
    super("stop", {
      aliases: ["stop"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.close("Stopping for now...")
    } catch (error) {
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default ResetCommand

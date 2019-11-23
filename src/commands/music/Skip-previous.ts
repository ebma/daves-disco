import { MusicCommand } from "./MusicCommand"

class SkipPrevious extends MusicCommand {
  constructor() {
    super("skip-previous", {
      aliases: ["skip-previous"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    this.musicPlayer.skipPrevious()
    return this.sendMessageToChannel(`Skipped to the previous song!`)
  }
}

export default SkipPrevious

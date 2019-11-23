import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { MusicCommand } from "./MusicCommand"

class ResetCommand extends MusicCommand {
  constructor() {
    super("reset", {
      aliases: ["reset"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    try {
      this.musicPlayer.clear()
      this.musicPlayer.close("Reset")
      MusicPlayerManager.removePlayerFor(this.guild.id)
      return this.sendMessageToChannel("Successfully resetted the music player.")
    } catch (error) {
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default ResetCommand

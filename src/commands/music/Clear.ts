import _ from "lodash"
import { MusicCommand } from "./MusicCommand"

class ClearCommand extends MusicCommand {
  constructor() {
    super("clear", {
      aliases: ["clear", "shut up", "stop"],
      channelRestriction: "guild"
    })
  }

  async execute() {
    this.musicPlayer.clear()
    return this.sendMessageToChannel("OK I'll stop playing more :fire: songs")
  }
}

export default ClearCommand

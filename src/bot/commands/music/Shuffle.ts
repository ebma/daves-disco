import _ from "lodash"
import { MusicCommand } from "./MusicCommand"

class ShuffleCommand extends MusicCommand {
  constructor() {
    super("shuffle", {
      aliases: ["shuffle", "mix"],
      channel: "guild"
    })
  }

  async execute() {
    if (this.musicPlayer.queue.size() === 0) {
      return this.sendMessageToChannel("There's nothing to shuffle as the queue is empty... :shrug:")
    }

    this.musicPlayer.shuffle()

    return this.sendMessageToChannel("I spiced it up a bit! :fire:")
  }
}

export default ShuffleCommand

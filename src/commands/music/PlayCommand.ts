import _ from "lodash"

import { trackError } from "../../shared/util/trackError"
import { MusicCommand } from "./MusicCommand"
import { handlePlay } from "./play"

class PlayCommand extends MusicCommand {
  constructor() {
    super("play", {
      aliases: ["play"],
      args: [
        {
          id: "data",
          type: "string",
          match: "content",
          prompt: {
            start: "What would you like me to play? (Enter URL or search term)",
            retry: "You must either enter a valid url or the title and I will search for it."
          }
        }
      ],
      channel: "guild"
    })
  }

  async execute(args: { data: string }) {
    const userInput: string = args.data

    try {
      const result = await handlePlay(userInput, this.musicPlayer)
      return this.sendMessageToChannel(result)
    } catch (error) {
      trackError(error, "PlayCommand.execute")
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default PlayCommand

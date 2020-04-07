import _ from "lodash"
import { MusicCommand } from "./MusicCommand"

class VolumeCommand extends MusicCommand {
  constructor() {
    super("volume", {
      aliases: ["volume"],
      args: [
        {
          id: "data",
          type: (message, phrase) => {
            if (!phrase || _.isNaN(phrase)) return null
            const num = parseInt(phrase, 10)
            if (num < 1 || num > 100) return null
            return num
          },
          prompt: {
            start: "Which volume level do you want? (1-100)",
            retry: "That's not a valid volume level! Try again."
          }
        }
      ],
      channel: "guild"
    })
  }

  async execute(args: { data: any }) {
    if (!this.member.voice.channel) {
      return this.sendMessageToChannel("You can't change the volume if you are not even listening...")
    }

    const oldVolume = this.musicPlayer.volume
    const newVolume = args.data
    if (oldVolume === newVolume) {
      return this.sendMessageToChannel(`Volume level is already at ${newVolume}...`)
    }

    this.musicPlayer.setVolume(newVolume)
    const reply =
      oldVolume > this.musicPlayer.volume
        ? `I reduced the volume from ${oldVolume} to ${newVolume}! :sound:`
        : `I increased the volume from ${oldVolume} to ${newVolume}! :loud_sound:`
    return this.sendMessageToChannel(reply)
  }
}

export default VolumeCommand

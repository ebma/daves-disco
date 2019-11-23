import _ from "lodash"
import { MusicCommand } from "./MusicCommand"

class VolumeCommand extends MusicCommand {
  constructor() {
    super("volume", {
      aliases: ["volume"],
      args: [
        {
          id: "data",
          type: word => {
            if (!word || _.isNaN(word)) return null
            const num = parseInt(word, 10)
            if (num < 1 || num > 100) return null
            return num
          },
          prompt: {
            start: "Which volume level do you want? (1-100)",
            retry: "That's not a valid volume level! Try again."
          }
        }
      ],
      channelRestriction: "guild"
    })
  }

  async execute(args: { data: any }) {
    if (!this.member.voiceChannel) {
      return this.sendMessageToChannel("You can't change the volume if you are not even listening...")
    }

    console.log("args in volume command", args)

    const oldVolume = this.musicPlayer.getVolume()
    const newVolume = args.data
    if (oldVolume === newVolume) {
      return this.sendMessageToChannel(`Volume level is already at ${newVolume}...`)
    }

    this.musicPlayer.setVolume(newVolume)
    const reply =
      oldVolume > this.musicPlayer.getVolume()
        ? `I reduced the volume from ${oldVolume} to ${newVolume}! :sound:`
        : `I increased the volume from ${oldVolume} to ${newVolume}! :loud_sound:`
    return this.sendMessageToChannel(reply)
  }
}

export default VolumeCommand

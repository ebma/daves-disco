import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"

class VolumeCommand extends Command {
  constructor() {
    super("volume", {
      aliases: ["volume"],
      args: [
        {
          id: "newVolume",
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

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (!message.member.voiceChannel) {
      return message.reply("You can't change the volume if you are not even listening...")
    }
    
    const oldVolume = musicPlayer.getVolume()
    const newVolume = args.newVolume
    if (oldVolume === newVolume) {
      return message.reply(`Volume level is already at ${newVolume}...`)
    }

    musicPlayer.setVolume(newVolume)
    const reply =
      oldVolume > musicPlayer.getVolume()
        ? `I reduced the volume from ${oldVolume} to ${newVolume}! :sound:`
        : `I increased the volume from ${oldVolume} to ${newVolume}! :loud_sound:`
    return message.reply(reply)
  }
}

export default VolumeCommand

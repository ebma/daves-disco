import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import _ from "lodash"

class SkipCommand extends Command {
  constructor() {
    super("skip", {
      aliases: ["skip"],
      args: [
        {
          id: "amount",
          default: 1,
          type: word => {
            if (!word || _.isNaN(word)) return null
            const num = parseInt(word, 10)
            if (num < 1) return null
            return num
          },
          match: "content",
          prompt: {
            optional: true,
            retry: "You must skip at least 1 song.."
          }
        }
      ],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (!message.member.voiceChannel || message.member.voiceChannel.id !== musicPlayer.voiceConnection.channel.id) {
      return message.reply("You have to be connected the same voice channel...")
    }

    const suppliedAmount = args.amount
    const queueSize = musicPlayer.queuedTracks

    const skippingSongsCount = suppliedAmount > queueSize ? queueSize : suppliedAmount

    _.times(skippingSongsCount, () => {
      musicPlayer.skipSong()
    })

    return message.reply(`Successfully skipped ${skippingSongsCount} song(s)!`)
  }
}

export default SkipCommand

import { Message, TextChannel } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

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
    if (message === null) {
      return this.executeSilent(args)
    }

    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (!message.member.voiceChannel || message.member.voiceChannel.id !== musicPlayer.voiceConnection.channel.id) {
      return message.reply("You have to be connected the same voice channel...")
    }

    const suppliedAmount = args.amount
    const queueSize = musicPlayer.queue.size()

    if (args.amount === 1) {
      musicPlayer.skipCurrentSong()
      return message.reply(`Skipped the current song!`)
    } else {
      const skippingSongsCount = suppliedAmount > queueSize ? queueSize : suppliedAmount

      _.times(skippingSongsCount - 1, () => {
        musicPlayer.skipNextSongInQueue()
      })
      musicPlayer.skipCurrentSong()
      return message.reply(`Skipped the current song + ${skippingSongsCount - 1} more!`)
    }
  }

  executeSilent(args: CommandMessage) {
    return new Promise<void>((resolve, reject) => {
      const { guildID, userID } = args
      const guild = this.client.guilds.find(g => g.id === guildID)
      const member = guild.members.find(m => m.id === userID)
      const textChannel = guild.channels.find(
        channel => channel.name === "general" && channel.type === "text"
      ) as TextChannel

      const musicPlayer = MusicPlayerManager.getPlayerFor(guildID)

      try {
        if (musicPlayer.skipCurrentSong()) {
          textChannel.send(`${member} wanted me to skip the current song.`)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default SkipCommand

import { Message, TextChannel } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

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
    if (message === null) {
      return this.executeSilent(args)
    }
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

  executeSilent(args: CommandMessage) {
    return new Promise<void>(async (resolve, reject) => {
      const { guildID, userID } = args
      const guild = this.client.guilds.find(g => g.id === guildID)
      const member = guild.members.find(m => m.id === userID)
      const textChannel = guild.channels.find(
        channel => channel.name === "general" && channel.type === "text"
      ) as TextChannel

      const musicPlayer = MusicPlayerManager.getPlayerFor(guildID)

      console.log("received args", args)

      try {
        const newVolume = args.data

        musicPlayer.setVolume(newVolume)
        textChannel.send(`${member} changed to volume to ${newVolume}`)

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default VolumeCommand

import { Message, TextChannel } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

class SkipCommand extends Command {
  constructor() {
    super("skip-previous", {
      aliases: ["skip-previous"],
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

    musicPlayer.skipPrevious()
    return message.reply(`Skipped to the previous song!`)
  }

  executeSilent(args: CommandMessage) {
    return new Promise<void>((resolve, reject) => {
      const { guildID, userID } = args
      const guild = this.client.guilds.find(g => g.id === guildID)
      const member = guild.members.find(m => m.id === userID)
      const fallbackChannel = guild.channels.find(
        channel => channel.name === "general" && channel.type === "text"
      ) as TextChannel

      const musicPlayer = MusicPlayerManager.getPlayerFor(guildID)

      try {
        if (musicPlayer.skipPrevious()) {
          musicPlayer.trySendMessageToChannel(`${member} wanted me to skip to the previous song.`, fallbackChannel)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default SkipCommand

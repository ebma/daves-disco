import { Message, TextChannel } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

class ResumeCommand extends Command {
  constructor() {
    super("resume", {
      aliases: ["resume"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    if (message === null) {
      return this.executeSilent(args)
    }

    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    const error = await musicPlayer.resumeStream()
    return message.reply(error ? error : "Resuming...")
  }

  executeSilent(args: CommandMessage) {
    return new Promise<void>(async (resolve, reject) => {
      const { guildID, userID } = args
      const guild = this.client.guilds.find(g => g.id === guildID)
      const member = guild.members.find(m => m.id === userID)
      const fallbackChannel = guild.channels.find(
        channel => channel.name === "general" && channel.type === "text"
      ) as TextChannel

      const musicPlayer = MusicPlayerManager.getPlayerFor(guildID)

      try {
        const error = await musicPlayer.resumeStream()
        if (!error) {
          musicPlayer.trySendMessageToChannel(`${member} wants to keep going.`, fallbackChannel)
          resolve()
        } else {
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default ResumeCommand

import { Message, TextChannel } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { CommandMessage } from "../../typings/exported-types"

class PauseCommand extends Command {
  constructor() {
    super("pause", {
      aliases: ["pause"],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    const error = await musicPlayer.pauseStream()
    return message.reply(error ? error : "Pausing...")
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
        const error = musicPlayer.pauseStream()
        if (!error) {
          textChannel.send(`${member} requested a pause.`)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default PauseCommand
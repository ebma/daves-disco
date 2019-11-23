import { Command } from "discord-akairo"
import { Guild, GuildMember, Message, TextChannel, RichEmbed } from "discord.js"
import { MusicPlayer } from "../../libs/MusicPlayer"
import MusicPlayerManager from "../../libs/MusicPlayerManager"

export abstract class MusicCommand extends Command {
  protected musicPlayer: MusicPlayer
  protected guild: Guild
  protected member: GuildMember
  protected message?: Message

  abstract execute(data: any): void | Promise<void>

  async exec(message: Message, args: any) {
    if (!message) {
      return this.executeSilent(args)
    } else {
      this.message = message
    }

    this.musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)
    this.guild = message.guild
    this.member = message.member

    this.execute(args)
  }

  executeSilent(args: CommandMessage) {
    const { guildID, userID, data } = args
    const guild = this.client.guilds.find(g => g.id === guildID)
    const member = guild.members.find(m => m.id === userID)

    this.musicPlayer = MusicPlayerManager.getPlayerFor(guildID)
    this.guild = guild
    this.member = member

    this.execute(data)
  }

  sendMessageToChannel(message: string | RichEmbed) {
    const fallbackChannel = this.guild.channels.find(
      channel => channel.name === "general" && channel.type === "text"
    ) as TextChannel

    this.musicPlayer.trySendMessageToChannel(message, fallbackChannel)
  }
}

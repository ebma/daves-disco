import { Command } from "discord-akairo"
import _ from "lodash"
import { Guild, GuildMember, Message, TextChannel, MessageEmbed } from "discord.js"
import MusicPlayer from "../../../libs/MusicPlayer"
import MusicPlayerManager from "../../../libs/MusicPlayerManager"
import { trackError } from "../../../utils/trackError"

let messageQueue: string[] = []

export abstract class MusicCommand extends Command {
  protected musicPlayer: MusicPlayer
  protected guild: Guild
  protected member: GuildMember
  protected message: Message

  abstract execute(args: { data: any }): void | Promise<void>

  private async initPlayer(member: GuildMember) {
    this.musicPlayer = MusicPlayerManager.getPlayerFor(member.guild.id)
    if (!this.musicPlayer) {
      if (!member.voice.channel) {
        throw new Error("You have to be connected to a voice channel...")
      } else if (!member.voice.channel.joinable) {
        throw new Error(`Could not join voice channel of ${member.displayName}`)
      } else {
        this.musicPlayer = await MusicPlayerManager.createPlayerFor(member.guild.id, member.voice.channel)
        this.musicPlayer.subscribe({
          next: message => {
            if (message.messageType === "info" || message.messageType === "error") {
              // Don't send messages to channel to prevent spam
              // this.sendMessageToChannel(message.message)
            }
          }
        })
      }
    }
  }

  async exec(message: Message, args: any) {
    this.message = message
    this.guild = message.guild
    this.member = message.member

    try {
      await this.initPlayer(this.member)
      this.execute(args)
    } catch (error) {
      trackError(error, "MusicCommand.exec")
      if (error instanceof Error) {
        this.sendMessageToChannel(error.message)
      } else {
        this.sendMessageToChannel(error)
      }
    }
  }

  private sendStringMessage = _.debounce(
    channel => {
      if (channel && messageQueue.length > 0) {
        const longMessage = messageQueue.join("\n")
        channel.send(longMessage)
        messageQueue = []
      }
    },
    2000,
    { leading: false, trailing: true }
  )

  sendMessageToChannel(message: string | MessageEmbed) {
    const defaultChannel = this.message.channel

    if (message instanceof MessageEmbed) {
      defaultChannel.send(message)
    } else {
      messageQueue.push(message)
      this.sendStringMessage(defaultChannel)
    }
  }
}

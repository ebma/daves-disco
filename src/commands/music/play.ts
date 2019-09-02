import { MusicPlayer } from "./../../libs/MusicPlayer"
import { Message } from "discord.js"
import { Command } from "discord-akairo"

class PlayCommand extends Command {
  private musicPlayer: MusicPlayer

  constructor() {
    super("play", {
      aliases: ["play"],
      args: [
        {
          id: "trackInfo",
          type: "string",
          match: "content",
          prompt: {
            start: "What would you like me to play? (url or search term)",
            retry: "You must either enter a valid url or the title and I will search for it."
          }
        }
      ],
      channelRestriction: "guild"
    })
    this.musicPlayer = new MusicPlayer()
  }

  async exec(message: Message, args: any) {
    if (message.member.voiceChannel) {
      try {
        await this.musicPlayer.join(message.member.voiceChannel)
      } catch (error){
        console.error(error)
      }
      await this.musicPlayer.enqueue({ title: args.trackInfo })
      await this.musicPlayer.play(message)
      return message.reply("I successfully added your song")
    }
    else {
      return message.reply("You have to be connected to a voice channel...")
    }
  }
}

export default PlayCommand

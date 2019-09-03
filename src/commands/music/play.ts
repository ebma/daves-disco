import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import { createTrackFromSearchTerm } from "../../libs/youtube"
import { createEmbedForTrack } from "../../libs/embeds"

class PlayCommand extends Command {
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
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (message.member.voiceChannel) {
      try {
        await musicPlayer.join(message.member.voiceChannel)
      } catch (error) {
        console.error(error)
      }

      const track = await createTrackFromSearchTerm(args.trackInfo)
      await musicPlayer.enqueue(track)
      await musicPlayer.play(message)

      const trackEmbed = createEmbedForTrack(track, message.member)
      return message.channel.send(trackEmbed)
    } else {
      return message.reply("You have to be connected to a voice channel...")
    }
  }
}

export default PlayCommand

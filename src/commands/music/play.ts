import { Message } from "discord.js"
import { Command } from "discord-akairo"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import {
  createTracksFromPlayList,
  isYoutubePlaylist,
  isYoutubeVideo,
  createTracksFromSearchTerm,
  createTrackFromURL
} from "../../libs/youtube"
import { createEmbedForTrack, createEmbedForTracks } from "../../libs/embeds"
import _ from "lodash"
import { RichEmbed } from "discord.js"

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
            start: "What would you like me to play? (Enter URL or search term)",
            retry: "You must either enter a valid url or the title and I will search for it."
          }
        }
      ],
      channelRestriction: "guild"
    })
  }

  async exec(message: Message, args: any) {
    const musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (!message.member.voiceChannel) {
      return message.reply("You have to be connected to a voice channel...")
    }

    try {
      await musicPlayer.join(message.member.voiceChannel)
    } catch (error) {
      return message.reply(`Couldn't join voice channel, because: ${error} :unamused: `)
    }

    const userInput: string = args.trackInfo

    let reply: RichEmbed | string = ""

    if (isYoutubePlaylist(userInput)) {
      const playlistID = new URL(userInput).searchParams.get("list")
      const tracks = await createTracksFromPlayList(playlistID)
      _.forEach(tracks, track => {
        musicPlayer.enqueue(track)
      })
      reply = createEmbedForTracks(tracks, message.member)
    } else if (isYoutubeVideo(userInput)) {
      const track = await createTrackFromURL(userInput)
      await musicPlayer.enqueue(track)
      reply = createEmbedForTrack(track, message.member)
    } else {
      const tracks = await createTracksFromSearchTerm(args.trackInfo, 1)
      const track = tracks[0]
      await musicPlayer.enqueue(track)
      reply = createEmbedForTrack(track, message.member)
    }

    await musicPlayer.play(message)
    return message.channel.send(reply)
  }
}

export default PlayCommand

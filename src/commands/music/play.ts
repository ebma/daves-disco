import { MusicPlayer } from "./../../libs/MusicPlayer"
import { Message } from "discord.js"
import { Command } from "discord-akairo"
import _ from "lodash"
import { RichEmbed } from "discord.js"
import MusicPlayerManager from "../../libs/MusicPlayerManager"
import {
  createTracksFromPlayList,
  isYoutubePlaylist,
  isYoutubeVideo,
  createTracksFromSearchTerm,
  createTrackFromURL
} from "../../libs/util/youtube"
import { createEmbedForTrack, createEmbedForTracks, createEmbedsForSpotifyPlaylist } from "../../libs/util/embeds"
import { isSpotifyPlaylistURI, getSpotifyPlaylist } from "../../libs/util/spotify"

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
            start: "What would you like me to play? (Enter URL or search term)",
            retry: "You must either enter a valid url or the title and I will search for it."
          }
        }
      ],
      channelRestriction: "guild"
    })
  }

  handleYoutubeVideo = async (videoURL: string) => {
    const track = await createTrackFromURL(videoURL)
    await this.musicPlayer.enqueue(track)
    return createEmbedForTrack(track)
  }

  handleYoutubePlaylist = async (playlistID: string) => {
    const playlist = await createTracksFromPlayList(playlistID)
    _.forEach(playlist.tracks, track => {
      this.musicPlayer.enqueue(track)
    })
    return createEmbedForTracks(playlist.tracks)
  }

  handleSpotifyPlaylist = async (playlistID: string) => {
    const playlist = await getSpotifyPlaylist(playlistID)
    if (playlist === null) {
      return "I was not able to get the spotify playlist..."
    } else {
      _.forEach(playlist.tracks, track => {
        this.musicPlayer.enqueue(track)
      })

      return createEmbedsForSpotifyPlaylist(playlist)
    }
  }

  handleSearch = async (searchTerm: string) => {
    const tracks = await createTracksFromSearchTerm(searchTerm, 1)
    const track = tracks[0]
    await this.musicPlayer.enqueue(track)
    return createEmbedForTrack(track)
  }

  async exec(message: Message, args: any) {
    this.musicPlayer = MusicPlayerManager.getPlayerFor(message.guild.id)

    if (!message.member.voiceChannel) {
      return message.reply("You have to be connected to a voice channel...")
    }

    try {
      await this.musicPlayer.join(message.member.voiceChannel)
    } catch (error) {
      return message.reply(`Couldn't join voice channel, because: ${error} :unamused: `)
    }

    const userInput: string = args.trackInfo

    let reply: RichEmbed | string = ""

    try {
      if (isYoutubePlaylist(userInput)) {
        const playlistID = new URL(userInput).searchParams.get("list")
        reply = await this.handleYoutubePlaylist(playlistID)
      } else if (isYoutubeVideo(userInput)) {
        reply = await this.handleYoutubeVideo(userInput)
      } else if (isSpotifyPlaylistURI(userInput)) {
        const playlistID = userInput.split(":")[userInput.split(":").length - 1]
        reply = await this.handleSpotifyPlaylist(playlistID)
      } else {
        reply = await this.handleSearch(userInput)
      }
      await this.musicPlayer.play(message)
      return message.channel.send(reply)
    } catch (error) {
      return message.channel.send(`Something went wrong... ${error}`)
    }
  }
}

export default PlayCommand

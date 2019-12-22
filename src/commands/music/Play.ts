import _ from "lodash"
import { RichEmbed } from "discord.js"
import { createEmbedForTrack, createEmbedForTracks, createEmbedsForSpotifyPlaylist } from "../../libs/util/embeds"
import { isSpotifyPlaylistURI, getSpotifyPlaylist } from "../../libs/util/spotify"
import { trackError } from "../../shared/util/trackError"
import Youtube from "../../shared/util/Youtube"
import { MusicCommand } from "./MusicCommand"

class PlayCommand extends MusicCommand {
  constructor() {
    super("play", {
      aliases: ["play"],
      args: [
        {
          id: "data",
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
    const track = await Youtube.createTrackFromURL(videoURL)
    await this.musicPlayer.enqueue(track)
    return createEmbedForTrack(track)
  }

  handleYoutubePlaylist = async (playlistID: string) => {
    const playlist = await Youtube.createPlaylistFrom(playlistID)
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
    const tracks = await Youtube.createTracksFromSearchTerm(searchTerm, 1)
    const track = tracks[0]
    await this.musicPlayer.enqueue(track)
    return createEmbedForTrack(track)
  }

  async execute(args: { data: any }) {
    if (!this.member.voiceChannel) {
      return this.sendMessageToChannel("You have to be connected to a voice channel...")
    }

    try {
      await this.musicPlayer.join(this.member.voiceChannel)
    } catch (error) {
      return this.sendMessageToChannel(`Couldn't join voice channel, because: ${error} :unamused: `)
    }

    const userInput: string = args.data

    let reply: RichEmbed | string = ""

    try {
      if (Youtube.isYoutubePlaylist(userInput)) {
        const playlistID = new URL(userInput).searchParams.get("list")
        reply = await this.handleYoutubePlaylist(playlistID)
      } else if (Youtube.isYoutubeVideo(userInput)) {
        reply = await this.handleYoutubeVideo(userInput)
      } else if (isSpotifyPlaylistURI(userInput)) {
        const playlistID = userInput.split(":")[userInput.split(":").length - 1]
        reply = await this.handleSpotifyPlaylist(playlistID)
      } else {
        reply = await this.handleSearch(userInput)
      }
      return this.sendMessageToChannel(reply)
    } catch (error) {
      trackError(error, "PlayCommand.execute")
      return this.sendMessageToChannel(`Something went wrong... ${error}`)
    }
  }
}

export default PlayCommand

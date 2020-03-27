import { MessageEmbed } from "discord.js"
import Youtube from "../../shared/util/Youtube"
import Spotify from "../../shared/util/Spotify"
import { createEmbedForTrack, createEmbedForTracks, createEmbedsForSpotifyPlaylist } from "../../libs/util/embeds"
import MusicPlayer from "../../libs/MusicPlayer"

async function getTrackFromYoutubeVideo(videoURL: string) {
  const track = await Youtube.createTrackFromURL(videoURL)
  return track
}

async function getTracksFromYoutubePlaylist(playlistID: string) {
  const playlist = await Youtube.createPlaylistFrom(playlistID)
  return playlist.tracks
}

async function handleSpotifyPlaylist(playlistID: string) {
  const playlist = await Spotify.getSpotifyPlaylist(playlistID)
  if (playlist === null) {
    throw Error("I was not able to get the spotify playlist...")
  } else {
    return playlist
  }
}

async function handleSearch(searchTerm: string) {
  const tracks = await Youtube.createTracksFromSearchTerm(searchTerm, 1)
  const track = tracks[0]
  return track
}

export async function handlePlay(input: string, musicPlayer: MusicPlayer) {
  let reply: MessageEmbed | string = ""

  if (Youtube.isYoutubePlaylist(input)) {
    const playlistID = new URL(input).searchParams.get("list")
    const tracks = await getTracksFromYoutubePlaylist(playlistID)
    musicPlayer.enqueueAll(tracks)

    reply = createEmbedForTracks(tracks)
  } else if (Youtube.isYoutubeVideo(input)) {
    const track = await getTrackFromYoutubeVideo(input)
    musicPlayer.enqueue(track)

    reply = createEmbedForTrack(track)
  } else if (Spotify.isSpotifyPlaylistURI(input)) {
    const playlistID = input.split(":")[input.split(":").length - 1]
    const playlist = await handleSpotifyPlaylist(playlistID)
    musicPlayer.enqueueAll(playlist.tracks)

    reply = createEmbedsForSpotifyPlaylist(playlist)
  } else {
    const track = await handleSearch(input)
    musicPlayer.enqueue(track)

    reply = createEmbedForTrack(track)
  }
  return reply
}

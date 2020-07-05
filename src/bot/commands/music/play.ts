import { MessageEmbed } from "discord.js"
import Youtube from "../../../libs/Youtube"
import Spotify from "../../../libs/Spotify"
import { createEmbedForTrack, createEmbedForTracks, createEmbedsForSpotifyPlaylist } from "../../../utils/embeds"
import MusicPlayer from "../../../libs/MusicPlayer"
import { SpotifyHelper } from "../../../shared/utils/helpers"
import { createAndSavePlaylistModel, createAndSaveTrackModel } from "../../../db/models/helper"

async function getTrackFromYoutubeVideo(videoURL: string) {
  const track = await Youtube.createTrackFromURL(videoURL)
  return track
}

async function getYoutubePlaylist(playlistID: string) {
  const playlist = await Youtube.createPlaylistFrom(playlistID)
  return playlist
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

export async function handlePlay(input: string, guildID: GuildID, musicPlayer: MusicPlayer) {
  let reply: MessageEmbed | string = ""

  if (Youtube.describesYoutubePlaylist(input)) {
    const playlistID = new URL(input).searchParams.get("list")
    const playlist = await getYoutubePlaylist(playlistID)

    const playlistModel = await createAndSavePlaylistModel(playlist, guildID)
    musicPlayer.enqueueAll(playlistModel.tracks)

    reply = createEmbedForTracks(playlist.tracks)
  } else if (Youtube.isYoutubeVideo(input)) {
    const track = await getTrackFromYoutubeVideo(input)

    const trackModel = await createAndSaveTrackModel(track, guildID)
    musicPlayer.enqueue(trackModel)

    reply = createEmbedForTrack(track)
  } else if (SpotifyHelper.isSpotifyPlaylistUri(input)) {
    const playlistID = SpotifyHelper.getIDFromUri(input)
    const playlist = await handleSpotifyPlaylist(playlistID)

    const playlistModel = await createAndSavePlaylistModel(playlist, guildID)
    musicPlayer.enqueueAll(playlistModel.tracks)

    reply = createEmbedsForSpotifyPlaylist(playlist)
  } else if (SpotifyHelper.isSpotifyPlaylistUrl(input)) {
    const playlistID = SpotifyHelper.getIDFromUrl(input)
    const playlist = await handleSpotifyPlaylist(playlistID)

    const playlistModel = await createAndSavePlaylistModel(playlist, guildID)
    musicPlayer.enqueueAll(playlistModel.tracks)

    reply = createEmbedsForSpotifyPlaylist(playlist)
  } else {
    const track = await handleSearch(input)

    const trackModel = await createAndSaveTrackModel(track, guildID)
    musicPlayer.enqueue(trackModel)

    reply = createEmbedForTrack(track)
  }
  return reply
}

export async function playPlaylist(playlist: Playlist, guildID: GuildID, musicPlayer: MusicPlayer) {
  const populatedPlaylist =
    playlist.source === "spotify" ? await handleSpotifyPlaylist(playlist.id) : await getYoutubePlaylist(playlist.id)

  const playlistModel = await createAndSavePlaylistModel(populatedPlaylist, guildID)
  musicPlayer.enqueueAll(playlistModel.tracks)
}

export async function playTrack(track: Track, guildID: GuildID, musicPlayer: MusicPlayer) {
  const trackModel = await createAndSaveTrackModel(track, guildID)
  musicPlayer.enqueue(trackModel)
}

export async function playSound(source: string, volume: number, musicPlayer: MusicPlayer) {
  musicPlayer.playSound(source, volume)
}

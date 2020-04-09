import { MessageEmbed } from "discord.js"
import Youtube from "../../../libs/Youtube"
import Spotify from "../../../libs/Spotify"
import { createEmbedForTrack, createEmbedForTracks, createEmbedsForSpotifyPlaylist } from "../../../utils/embeds"
import MusicPlayer from "../../../libs/MusicPlayer"
import Playlist from "../../../db/models/playlist"
import Track from "../../../db/models/track"
import { SpotifyHelper } from "../../../shared/utils/helpers"

function trySavingPlaylist(playlist: Playlist, guildID: GuildID) {
  const playlistModel = new Playlist({ guild: guildID, ...playlist })
  playlistModel.save({}, err => {
    if (err) {
      console.log(`Saving playlist '${playlist.name}' failed`, err.message)
    } else {
      // notifyRecentHistoryChange(guildID)
    }
  })
}

function trySavingTrack(track: Track, guildID: GuildID) {
  const trackModel = new Track({ guild: guildID, ...track })
  trackModel.save({}, err => {
    if (err) {
      console.log(`Saving track '${track.title}' failed`, err.message)
    } else {
      // notifyRecentHistoryChange(guildID)
    }
  })
}

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

    musicPlayer.enqueueAll(playlist.tracks)
    trySavingPlaylist(playlist, guildID)

    reply = createEmbedForTracks(playlist.tracks)
  } else if (Youtube.isYoutubeVideo(input)) {
    const track = await getTrackFromYoutubeVideo(input)

    musicPlayer.enqueue(track)
    trySavingTrack(track, guildID)

    reply = createEmbedForTrack(track)
  } else if (SpotifyHelper.isSpotifyPlaylistURI(input)) {
    const playlistID = input.split(":")[input.split(":").length - 1]
    const playlist = await handleSpotifyPlaylist(playlistID)

    musicPlayer.enqueueAll(playlist.tracks)
    trySavingPlaylist(playlist, guildID)

    reply = createEmbedsForSpotifyPlaylist(playlist)
  } else {
    const track = await handleSearch(input)

    musicPlayer.enqueue(track)
    trySavingTrack(track, guildID)

    reply = createEmbedForTrack(track)
  }
  return reply
}

export async function playPlaylist(playlist: Playlist, guildID: GuildID, musicPlayer: MusicPlayer) {
  const populatedPlaylist =
    playlist.source === "spotify" ? await handleSpotifyPlaylist(playlist.id) : await getYoutubePlaylist(playlist.id)

  musicPlayer.enqueueAll(populatedPlaylist.tracks)
  trySavingPlaylist(populatedPlaylist, guildID)
}

export async function playTrack(track: Track, guildID: GuildID, musicPlayer: MusicPlayer) {
  musicPlayer.enqueue(track)
  trySavingTrack(track, guildID)
}

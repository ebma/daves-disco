import { GuildMember, EmbedBuilder } from "discord.js";
import _ from "lodash"
import { SpotifyHelper } from "../shared/utils/helpers"

export function createEmbedForTrack(track: Track, requester?: GuildMember) {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(track.title)
    .setURL(track.url)
    .setDescription(track.description.substring(0, 97).concat("..."))
    .setThumbnail(track.thumbnail?.medium)
    .setTimestamp()

  return embed
}

export function createEmbedForTracks(tracks: Track[], requester?: GuildMember) {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Playlist")
    .setTimestamp()

  let trackDescription = ""
  _.forEach(tracks, (track, index) => {
    if (SpotifyHelper.isSpotifyTrack(track)) {
      trackDescription += `${index + 1}: ${track.title} - ${track.artists} \n`
    } else {
      trackDescription += `${index + 1}: ${track.title}\n`
    }
  })

  const validStrings = splitIntoValidStrings(trackDescription)
  _.forEach(validStrings, (description, index) => {
    if (index === 0) {
      embed.addFields({ name: "Tracks", value: description })
    } else if (index <= 2) {
      embed.addFields({ name: "More", value: description })
    } else {
      embed.addFields({ name: "And even more", value: "..." })
    }
  })

  if (requester) {
    embed.setFooter({text: `Songs requested from ${requester.displayName}`})
  }

  return embed
}

export function createEmbedsForSpotifyPlaylist(playlist: Playlist, requester?: GuildMember) {
  const playlistEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(playlist.name)
    .setAuthor({name: playlist.owner})
    .setTimestamp()

  if (requester) {
    playlistEmbed.setFooter({text: `Songs requested from ${requester.displayName}`})
  }

  let tracklistDescription = ""
  _.forEach(playlist.tracks, (track, index) => {
    const spotifyTrack = track as SpotifyTrack
    tracklistDescription += `${index + 1}: ${spotifyTrack.title} - ${spotifyTrack.artists}\n`
  })

  const descriptions = splitIntoValidStrings(tracklistDescription)

  _.forEach(descriptions, (description, index) => {
    if (index === 0) {
      playlistEmbed.addFields({ name: "Tracks", value: description })
    } else if (index <= 2) {
      playlistEmbed.addFields({ name: "More", value: description })
    } else {
      playlistEmbed.addFields({ name: "And even more", value: "..." })
    }
  })

  return playlistEmbed
}

const characterLimit = 1024
function splitIntoValidStrings(splitme: string): string[] {
  const validSubStrings: string[] = []

  const lines = splitme.split("\n")

  let appendable = ""
  _.forEach(lines, line => {
    if (appendable.length + line.length >= characterLimit) {
      validSubStrings.push(appendable)
      appendable = ""
    }

    appendable += `${line}\n`
  })

  validSubStrings.push(appendable)

  return validSubStrings
}

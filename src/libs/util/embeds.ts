import { RichEmbed } from "discord.js"
import { GuildMember } from "discord.js"
import _ from "lodash"
import { SpotifyTrack, Track } from "../../typings/exported-types"

export function createEmbedForTrack(track: Track, requester?: GuildMember) {
  const embed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(track.title)
    .setURL(track.url)
    .setDescription(track.description.substring(0, 97).concat("..."))
    .setThumbnail(track.thumbnail)
    .setTimestamp()

  return embed
}

export function createEmbedForTracks(tracks: Track[], requester?: GuildMember) {
  const embed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle("Playlist")
    .setTimestamp()

  let trackDescription = ""
  _.forEach(tracks, (track, index) => {
    trackDescription += `${index + 1}: ${track.title} \n`
  })

  const validStrings = splitIntoValidStrings(trackDescription)
  _.forEach(validStrings, (description, index) => {
    if (index === 0) {
      embed.addField("Tracks", description)
    } else if (index <= 2) {
      embed.addField("More...", description)
    } else {
      embed.addField("And even more", "...")
    }
  })

  if (requester) {
    embed.setFooter(`Songs requested from ${requester.displayName}`)
  }

  return embed
}

export function createEmbedsForSpotifyPlaylist(playlist: Playlist, requester?: GuildMember) {
  const playlistEmbed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(playlist.name)
    .setAuthor(playlist.owner)
    .setTimestamp()

  if (requester) {
    playlistEmbed.setFooter(`Songs requested from ${requester.displayName}`)
  }

  let tracklistDescription = ""
  _.forEach(playlist.tracks, (track, index) => {
    const spotifyTrack = track as SpotifyTrack
    tracklistDescription += `${index + 1}: ${spotifyTrack.title} - ${spotifyTrack.artists}\n`
  })

  const descriptions = splitIntoValidStrings(tracklistDescription)

  _.forEach(descriptions, (description, index) => {
    if (index === 0) {
      playlistEmbed.addField("Tracks", description)
    } else if (index <= 2) {
      playlistEmbed.addField("More...", description)
    } else {
      playlistEmbed.addField("And even more", "...")
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

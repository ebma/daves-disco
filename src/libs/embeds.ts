import { RichEmbed } from "discord.js"
import { GuildMember } from "discord.js"
import _ from "lodash"

export function createEmbedForTrack(track: YoutubeTrack, requester?: GuildMember) {
  const embed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(track.title)
    .setURL(track.url)
    .setDescription(track.description)
    .setThumbnail(track.thumbnail)
    .setTimestamp()


  return embed
}

export function createEmbedForTracks(tracks: YoutubeTrack[], requester?: GuildMember) {
  const embed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle("Playlist")
    .setTimestamp()

  _.forEach(tracks, (track,index) => {
    embed.addField(`${index + 1}: ${track.title}`, track.url, true)
  })

  if (requester) {
    embed.setFooter(`Song requested from ${requester.displayName}`)
  }

  return embed
}

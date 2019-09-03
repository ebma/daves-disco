import { RichEmbed } from "discord.js"
import { GuildMember } from "discord.js"

export function createEmbedForTrack(track: YoutubeTrack, requester?: GuildMember) {
  const exampleEmbed = new RichEmbed()
    .setColor("#0099ff")
    .setTitle(track.title)
    .setURL(track.url)
    .setDescription(track.description)
    .setThumbnail(track.thumbnail)
    .setFooter(`Song requested from ${requester.displayName}`)
    .setTimestamp()

  return exampleEmbed
}
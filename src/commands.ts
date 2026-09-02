import { SlashCommandBuilder, type ChatInputCommandInteraction, type GuildMember } from 'discord.js'
import type { Player } from './player.js'
import { resolve, type Track } from './sources.js'

export const definitions = [
  new SlashCommandBuilder().setName('play').setDescription('Play a URL or search YouTube')
    .addStringOption((o) => o.setName('query').setDescription('URL or search text').setRequired(true)),
  new SlashCommandBuilder().setName('pause').setDescription('Pause playback'),
  new SlashCommandBuilder().setName('resume').setDescription('Resume playback'),
  new SlashCommandBuilder().setName('skip').setDescription('Skip the current track'),
  new SlashCommandBuilder().setName('stop').setDescription('Stop and leave the voice channel'),
  new SlashCommandBuilder().setName('queue').setDescription('Show the queue'),
  new SlashCommandBuilder().setName('np').setDescription('Show what is playing'),
  new SlashCommandBuilder().setName('volume').setDescription('Set volume 0-200')
    .addIntegerOption((o) => o.setName('percent').setDescription('0-200').setRequired(true).setMinValue(0).setMaxValue(200)),
  new SlashCommandBuilder().setName('seek').setDescription('Jump to a position')
    .addStringOption((o) => o.setName('to').setDescription('mm:ss or seconds').setRequired(true)),
].map((b) => b.toJSON())

export const fmtTime = (sec: number) => {
  const s = Math.floor(sec)
  const [h, m, r] = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
  return (h ? `${h}:` : '') + `${h ? String(m).padStart(2, '0') : m}:${String(r).padStart(2, '0')}`
}

export const parseTime = (s: string) =>
  s.split(':').reverse().reduce((acc, part, i) => acc + Number(part) * 60 ** i, 0)

const fmtTrack = (t: Track) => `**${t.title}**${t.durationSec ? ` (${fmtTime(t.durationSec)})` : ''}`

export async function handle(i: ChatInputCommandInteraction, player: Player) {
  const member = i.member as GuildMember
  switch (i.commandName) {
    case 'play': {
      const channel = member.voice.channel
      if (!channel) return i.reply({ content: 'Join a voice channel first.', ephemeral: true })
      await i.deferReply()
      const tracks = await resolve(i.options.getString('query', true))
      if (!tracks.length) return i.editReply('Nothing found.')
      await player.join(channel)
      player.enqueue(tracks)
      return i.editReply(tracks.length === 1 ? `Queued ${fmtTrack(tracks[0])}` : `Queued ${tracks.length} tracks`)
    }
    case 'pause': player.pause(); return i.reply('Paused.')
    case 'resume': player.resume(); return i.reply('Resumed.')
    case 'skip': player.skip(); return i.reply('Skipped.')
    case 'stop': player.leave(); return i.reply('Stopped and left.')
    case 'np':
      if (!player.current) return i.reply({ content: 'Nothing is playing.', ephemeral: true })
      return i.reply(`${player.paused ? '⏸' : '▶️'} ${fmtTrack(player.current)} at ${fmtTime(player.elapsedSec)}`)
    case 'queue': {
      if (!player.current) return i.reply({ content: 'Queue is empty.', ephemeral: true })
      const lines = player.queue.slice(0, 10).map((t, n) => `${n + 1}. ${fmtTrack(t)}`)
      const more = player.queue.length > 10 ? `\n…and ${player.queue.length - 10} more` : ''
      return i.reply(`Now: ${fmtTrack(player.current)}\n${lines.join('\n')}${more}`)
    }
    case 'volume': {
      player.setVolume(i.options.getInteger('percent', true))
      return i.reply(`Volume ${player.volume}%`)
    }
    case 'seek': {
      const to = parseTime(i.options.getString('to', true))
      if (Number.isNaN(to)) return i.reply({ content: 'Use mm:ss or seconds.', ephemeral: true })
      await player.seek(to)
      return i.reply(`Jumped to ${fmtTime(to)}`)
    }
  }
}

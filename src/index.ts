import { writeFileSync } from 'node:fs'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import { definitions, handle } from './commands.js'
import { config } from './config.js'
import { Player } from './player.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] })
const player = new Player()
player.onTrackError = (t, e) => console.error(`skipping "${t.title}":`, e instanceof Error ? e.message : e)
player.onTrackStart = (t) => console.log(`playing "${t.title}"`)

client.once(Events.ClientReady, async (c) => {
  const guild = await c.guilds.fetch(config.guildId)
  await c.application.commands.set([]) // drop stale global commands from older bots
  await guild.commands.set(definitions)
  console.log(`ready as ${c.user.tag} in ${guild.name}`)
  setInterval(() => writeFileSync('/tmp/alive', String(Date.now())), 30_000).unref()
})

client.on(Events.InteractionCreate, async (i) => {
  if (!i.isChatInputCommand() || i.guildId !== config.guildId) return
  try {
    await handle(i, player)
  } catch (e) {
    const msg = `Error: ${e instanceof Error ? e.message : String(e)}`.slice(0, 1900)
    console.error(msg)
    await (i.deferred || i.replied ? i.editReply(msg) : i.reply({ content: msg, ephemeral: true })).catch(() => {})
  }
})

// leave a minute after the last human leaves the bot's channel
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
  const ch = player.channelId
  if (!ch || (oldState.channelId !== ch && newState.channelId !== ch)) return
  const channel = newState.guild.channels.cache.get(ch)
  const humans = channel?.isVoiceBased() ? channel.members.filter((m) => !m.user.bot).size : 0
  player.humansPresent(humans > 0)
})

client.login(config.token)

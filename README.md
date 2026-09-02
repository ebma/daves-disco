# Dave's Disco v3

Single-guild Discord music bot. Plays YouTube (URL, playlist, search), SoundCloud,
direct stream / radio URLs and Suno song pages. No web UI, no database.

## Commands

`/play <query>` `/pause` `/resume` `/skip` `/stop` `/queue` `/np`
`/volume <0-200>` `/seek <mm:ss>`

## Setup

1. Create a bot at https://discord.com/developers/applications, enable no privileged
   intents, invite it with scopes `bot applications.commands` and permissions
   Connect + Speak + Send Messages.
2. `cp .env.example .env`, fill `DISCORD_TOKEN` and `GUILD_ID`.
3. `docker compose up -d --build`

Slash commands are registered for the guild on every start.

## Development

Needs Node 22, `ffmpeg` and `yt-dlp` on PATH.

```
npm install
npm run dev      # tsx watch, reads .env
npm test
```

## Notes

- YouTube from datacenter IPs may answer "Sign in to confirm you're not a bot".
  The image ships the bgutil PO-token provider, which handles most of it. If it
  persists, export cookies from a burner account (never your own) and mount
  them as described in `compose.yaml`.
- The bot leaves after `IDLE_MINUTES` with an empty queue, or one minute after
  the last human leaves the channel.
- Operations are documented for the Hermes agent in `hermes/SKILL.md`.

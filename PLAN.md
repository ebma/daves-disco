# Dave's Disco v3 — implementation plan

Backend-only Discord music bot for one guild, running as a Docker container on
the Hermes VPS, maintained by the Hermes agent. No web UI, no database.

## Scope

In: YouTube (URL, playlist, search), SoundCloud, direct stream / internet
radio URLs, Suno song pages (best effort). Play, pause, resume, skip, stop,
queue list, now-playing, volume, seek. Auto-leave when idle or alone.

Out (deliberately): web/socket control, GraphQL, MongoDB, Spotify, saved
playlists, soundboard, multi-guild, sharding, prefix commands.

## Stack (pinned at start, Sept 2026)

| Piece | Choice | Why |
|---|---|---|
| Runtime | Node 22 LTS, ESM, TypeScript 5, `tsx` dev / `tsc` build | Muse-proven, no bundler |
| Discord | discord.js 14.27, @discordjs/voice 0.19.2, @discordjs/opus | DAVE mandatory since 2026-03 |
| Audio | ffmpeg (apt) via `createAudioResource(..., {inlineVolume})` | seek = `-ss`, volume = inline |
| Extraction | `yt-dlp[default]` + `bgutil-ytdlp-pot-provider`, spawned with `node:child_process` | only maintained YouTube path; no npm wrapper needed |
| Tests | `node:test`, one file | |
| Deploy | Docker Compose, single service, HEALTHCHECK | Hermes pulls, rebuilds, restarts |

## One audio pipeline

Every source resolves to `{ title, durationSec, mediaUrl }`, then
`ffmpeg -ss <seek> -i <mediaUrl>` feeds the voice connection.

| Input | Resolver |
|---|---|
| YouTube URL / playlist / plain text | `yt-dlp -j -f bestaudio --flat-playlist` (search uses `ytsearch1:`) |
| SoundCloud URL | same yt-dlp call |
| `http(s)://…` not matched above | used as-is (radio / direct file) |
| `suno.com/song/<id>` | fetch page, read `og:audio` meta → `cdn1.suno.ai/<id>.mp3`. yt-dlp refuses Suno on policy grounds, so this is ~15 lines of our own; may break if Suno changes the page |

YouTube media URLs expire and are IP-bound, so resolution happens at play
time, not enqueue time. Playlists enqueue titles only (flat), resolved when
reached.

## Commands (slash, registered per guild at startup)

`/play <query>` · `/pause` · `/resume` · `/skip` · `/stop` · `/queue` ·
`/np` · `/volume <0-200>` · `/seek <mm:ss>`

Replies are short embeds; errors are ephemeral.

## Layout (5 source files)

```
src/index.ts      client, command router, guild guard
src/commands.ts   slash definitions + handlers
src/player.ts     queue, AudioPlayer, seek/volume, idle timer
src/sources.ts    input → Track resolvers (yt-dlp, suno, raw)
src/config.ts     env parsing (DISCORD_TOKEN, GUILD_ID, IDLE_MINUTES, YTDLP_COOKIES?)
test/sources.test.ts   which resolver picks which input; queue ops
Dockerfile, compose.yaml, .env.example, README.md
hermes/SKILL.md   ops runbook for the Hermes agent
```

## Behaviour details

- Idle: 5 min with empty queue, or 1 min after the last human leaves → disconnect.
- Volume default 100, clamped 0–200, kept per session in memory.
- Seek re-creates the ffmpeg resource at the offset; not available for live radio.
- Errors from yt-dlp (blocked, private, region) skip the track and post one line.
- Optional `YTDLP_COOKIES` path for a burner account; never a personal one.

## Docker and Hermes maintenance

- Image: `node:22-bookworm-slim` + `ffmpeg` + python venv with
  `yt-dlp[default]` and the PO-token plugin. Non-root user. ~250 MB RAM.
- HEALTHCHECK: bot touches `/tmp/alive` every 30 s while ready; check fails if
  older than 90 s. Compose `restart: unless-stopped`, `mem_limit: 512m`.
- `hermes/SKILL.md` gives the agent: how to view logs, restart, rebuild after
  `git pull`, run `yt-dlp -U` inside the container, what "Sign in to confirm
  you're not a bot" means and what to do. A Hermes cron job runs the yt-dlp
  update weekly and rebuilds monthly.

## Milestones

1. Skeleton: join voice, `/play` a YouTube URL, plays audio. Docker builds.
2. Queue + all commands, `/queue` and `/np` embeds.
3. SoundCloud, radio, Suno, search, playlists, seek, volume, auto-leave, test file.
4. Deploy on the VPS via Compose, write `hermes/SKILL.md`, hand over to Hermes.

## Open risks

- YouTube from a Hetzner IP may still be challenged despite PO tokens; SoundCloud and radio are the fallback. Cookies are the next lever.
- Suno resolver is unofficial; if it breaks, pasting the `cdn1.suno.ai` mp3 URL directly still works via the raw path.

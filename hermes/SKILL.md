---
name: daves-disco-ops
description: Operate the Dave's Disco Discord music bot (Docker Compose on this host). Use for restarting, updating, reading logs, and fixing YouTube playback errors.
---

# Dave's Disco operations

The bot runs as a Docker Compose service in `~/daves-disco` on this host.
Source: https://github.com/ebma/daves-disco branch `v3`.

## Commands (run from ~/daves-disco)

| Task | Command |
|---|---|
| Status / health | `docker compose ps` (health column) |
| Logs, last 200 lines | `docker compose logs --tail 200 bot` |
| Restart | `docker compose restart bot` |
| Update code and rebuild | `git pull && docker compose up -d --build` |
| Update yt-dlp only (weekly) | `docker compose build --no-cache --pull bot && docker compose up -d` |
| Check yt-dlp works from this IP | `docker compose exec bot yt-dlp -g -f bestaudio https://www.youtube.com/watch?v=dQw4w9WgXcQ` |

## Diagnosing

- **Health is `unhealthy`**: the bot has not written its heartbeat for 90 s. Check logs, then restart.
- **Logs say `skipping "<title>": ... Sign in to confirm you're not a bot`**: YouTube blocks this IP. First rebuild to get the newest yt-dlp and PO-token plugin. If it persists, tell Marcel a cookie file from a burner account is needed (see README, `compose.yaml`).
- **Logs say `missing env ...`**: `.env` lost a key. Never guess tokens; ask Marcel.
- **Voice close code 4017**: DAVE encryption rejected. `@discordjs/voice` must be updated in `package.json`; report it, do not patch blindly.
- **Container restarts in a loop**: `docker compose logs --tail 50 bot` and report the first error line.

## Rules

- Do not edit `.env` or commit anything. Report; Marcel changes code.
- Rebuilds take about two minutes and drop the current queue. Prefer doing them when `docker compose logs --tail 5 bot` shows no `playing` line in the last hour.
- Weekly cron: run the yt-dlp update row. Monthly: the update code row.

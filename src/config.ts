const need = (k: string): string => {
  const v = process.env[k]
  if (!v) throw new Error(`missing env ${k}`)
  return v
}

export const config = {
  token: need('DISCORD_TOKEN'),
  guildId: need('GUILD_ID'),
  idleMs: Number(process.env.IDLE_MINUTES ?? 5) * 60_000,
  cookies: process.env.YTDLP_COOKIES || undefined,
  bgutilHome: process.env.BGUTIL_HOME || undefined,
}

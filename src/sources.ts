import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { config } from './config.js'

const run = promisify(execFile)

export type Kind = 'ytdlp' | 'raw' | 'suno'
export type Track = { title: string; url: string; durationSec?: number; kind: Kind }

export function classify(input: string): Kind | 'search' {
  if (/^https?:\/\/(www\.)?suno\.com\/(song|s)\//i.test(input)) return 'suno'
  if (/^https?:\/\/([^/]+\.)?(youtube\.com|youtu\.be|soundcloud\.com)\//i.test(input)) return 'ytdlp'
  if (/^https?:\/\//i.test(input)) return 'raw'
  return 'search'
}

const ytdlpBase = () => [
  '--no-warnings', '--js-runtimes', 'node',
  ...(config.cookies ? ['--cookies', config.cookies] : []),
  ...(config.bgutilHome ? ['--extractor-args', `youtubepot-bgutilscript:server_home=${config.bgutilHome}`] : []),
]

/** Turn user input into one or more tracks (metadata only, no media URL yet). */
export async function resolve(input: string): Promise<Track[]> {
  const kind = classify(input)
  if (kind === 'raw') return [{ title: input, url: input, kind }]
  if (kind === 'suno') return [await suno(input)]
  const target = kind === 'search' ? `ytsearch1:${input}` : input
  const { stdout } = await run('yt-dlp', ['-J', '--flat-playlist', ...ytdlpBase(), target], { maxBuffer: 50e6 })
  const info = JSON.parse(stdout)
  const entries: any[] = info._type === 'playlist' ? info.entries ?? [] : [info]
  return entries.filter(Boolean).map((e) => ({
    title: e.title ?? e.url,
    url: e.webpage_url ?? e.url,
    durationSec: typeof e.duration === 'number' ? e.duration : undefined,
    kind: 'ytdlp' as const,
  }))
}

/** Fresh media URL at play time. YouTube URLs expire and are IP-bound. */
export async function mediaUrl(t: Track): Promise<string> {
  if (t.kind !== 'ytdlp') return t.url
  const { stdout } = await run('yt-dlp', ['-g', '-f', 'bestaudio/best', '--no-playlist', ...ytdlpBase(), t.url])
  const url = stdout.trim().split('\n')[0]
  if (!url) throw new Error('yt-dlp returned no media URL')
  return url
}

const UA = { 'user-agent': 'Mozilla/5.0' }

/** ponytail: unofficial. Anonymous clip API hides the mp3 but exposes the mp4; ffmpeg drops the video. */
async function suno(input: string): Promise<Track> {
  // follow /s/ short links; the final URL carries the clip id
  const page = await fetch(input, { headers: UA, redirect: 'follow' })
  const id = new URL(page.url).pathname.match(/\/song\/([0-9a-f-]{36})/i)?.[1]
  if (!id) throw new Error('no Suno song id in URL')
  const res = await fetch(`https://studio-api.prod.suno.com/api/clip/${id}`, { headers: UA })
  if (res.status === 404) throw new Error('Suno song not found (private or removed)')
  return parseSunoClip(await res.json(), input)
}

export function parseSunoClip(clip: any, fallbackTitle: string): Track {
  const url: string | undefined = clip?.video_url
  if (!url) throw new Error('Suno clip has no playable media')
  const durationSec = clip.metadata?.duration
  return { title: clip.title || fallbackTitle, url, kind: 'suno', ...(durationSec ? { durationSec } : {}) }
}

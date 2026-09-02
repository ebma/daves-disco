import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { config } from './config.js'

const run = promisify(execFile)

export type Kind = 'ytdlp' | 'raw' | 'suno'
export type Track = { title: string; url: string; durationSec?: number; kind: Kind }

export function classify(input: string): Kind | 'search' {
  if (/^https?:\/\/(www\.)?suno\.com\/song\//i.test(input)) return 'suno'
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
  if (kind === 'suno') return [parseSuno(await (await fetch(input)).text(), input)]
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

/** ponytail: unofficial. Suno pages expose the mp3 in og:audio; breaks if the page changes. */
export function parseSuno(html: string, pageUrl: string): Track {
  const meta = (p: string) =>
    html.match(new RegExp(`<meta[^>]+property="${p}"[^>]+content="([^"]+)"`))?.[1] ??
    html.match(new RegExp(`<meta[^>]+content="([^"]+)"[^>]+property="${p}"`))?.[1]
  const audio = meta('og:audio')
  if (!audio || /silence/.test(audio)) throw new Error('no audio found on Suno page')
  return { title: meta('og:title') ?? pageUrl, url: audio, kind: 'suno' }
}

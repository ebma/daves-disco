import assert from 'node:assert/strict'
import { test } from 'node:test'

process.env.DISCORD_TOKEN ??= 'x'
process.env.GUILD_ID ??= '1'
const { classify, parseSunoClip } = await import('../src/sources.js')
const { fmtTime, parseTime } = await import('../src/commands.js')

test('classify routes inputs', () => {
  assert.equal(classify('https://www.youtube.com/watch?v=abc'), 'ytdlp')
  assert.equal(classify('https://youtu.be/abc'), 'ytdlp')
  assert.equal(classify('https://soundcloud.com/a/b'), 'ytdlp')
  assert.equal(classify('https://suno.com/song/1234'), 'suno')
  assert.equal(classify('https://suno.com/s/abc'), 'suno')
  assert.equal(classify('https://stream.example.org/radio.mp3'), 'raw')
  assert.equal(classify('never gonna give you up'), 'search')
})

test('parseSunoClip uses the mp4 and duration', () => {
  const clip = { title: 'Drop it low', video_url: 'https://cdn1.suno.ai/x.mp4', metadata: { duration: 149 } }
  assert.deepEqual(parseSunoClip(clip, 'u'), { title: 'Drop it low', url: 'https://cdn1.suno.ai/x.mp4', kind: 'suno', durationSec: 149 })
  assert.throws(() => parseSunoClip({ title: 'x' }, 'u'))
})

test('time helpers round-trip', () => {
  assert.equal(fmtTime(75), '1:15')
  assert.equal(fmtTime(3661), '1:01:01')
  assert.equal(parseTime('1:15'), 75)
  assert.equal(parseTime('90'), 90)
  assert.equal(parseTime('1:01:01'), 3661)
})

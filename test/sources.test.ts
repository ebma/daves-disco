import assert from 'node:assert/strict'
import { test } from 'node:test'

process.env.DISCORD_TOKEN ??= 'x'
process.env.GUILD_ID ??= '1'
const { classify, parseSuno } = await import('../src/sources.js')
const { fmtTime, parseTime } = await import('../src/commands.js')

test('classify routes inputs', () => {
  assert.equal(classify('https://www.youtube.com/watch?v=abc'), 'ytdlp')
  assert.equal(classify('https://youtu.be/abc'), 'ytdlp')
  assert.equal(classify('https://soundcloud.com/a/b'), 'ytdlp')
  assert.equal(classify('https://suno.com/song/1234'), 'suno')
  assert.equal(classify('https://stream.example.org/radio.mp3'), 'raw')
  assert.equal(classify('never gonna give you up'), 'search')
})

test('parseSuno reads og:audio in either attribute order', () => {
  const a = '<meta property="og:title" content="My Song"/><meta property="og:audio" content="https://cdn1.suno.ai/x.mp3"/>'
  assert.deepEqual(parseSuno(a, 'u'), { title: 'My Song', url: 'https://cdn1.suno.ai/x.mp3', kind: 'suno' })
  const b = '<meta content="https://cdn1.suno.ai/y.mp3" property="og:audio">'
  assert.equal(parseSuno(b, 'u').url, 'https://cdn1.suno.ai/y.mp3')
  assert.throws(() => parseSuno('<meta property="og:audio" content="https://cdn1.suno.ai/silence.mp3">', 'u'))
})

test('time helpers round-trip', () => {
  assert.equal(fmtTime(75), '1:15')
  assert.equal(fmtTime(3661), '1:01:01')
  assert.equal(parseTime('1:15'), 75)
  assert.equal(parseTime('90'), 90)
  assert.equal(parseTime('1:01:01'), 3661)
})

import { Readable } from "stream"
import * as ytdl from "ytdl-core"
import search, { YouTubeSearchResults } from "youtube-search"

export async function createTrackStream(track: Track, callback: (stream: Readable) => void) {
  try {
    const trackURL = await findTrackUrl(track)

    const trackInfo = await ytdl.getInfo(trackURL)
    callback(
      ytdl
        .downloadFromInfo(trackInfo, { quality: "highestaudio", filter: "audioonly" })
        .on("error", err => console.error(err))
    )
  } catch (error) {
    console.error(error)
  }
}

function findTrackUrl(track: Track) {
  return new Promise<string>((resolve, reject) => {
    search(`${track.title}`, {maxResults: 10, key: process.env.YOUTUBE_API_KEY}).then(
      value => {
        if (value.results.length > 0) {
          resolve(value.results[0].link)
        } else {
          reject(`No result found for track: ${track}`)
        }
      },
      reason => {
        reject(reason)
      }
    )
  })
}

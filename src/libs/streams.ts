import { Readable } from "stream"
import * as ytdl from "ytdl-core"

export async function createTrackStream(track: YoutubeTrack, callback: (stream: Readable) => void) {
  try {
    const trackInfo = await ytdl.getInfo(track.url)
    callback(
      ytdl
        .downloadFromInfo(trackInfo, { quality: "highestaudio", filter: "audioonly" })
        .on("error", err => console.error(err))
    )
  } catch (error) {
    console.error(error)
  }
}

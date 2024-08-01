import ytdl from "ytdl-core"

export function downloadVideoWithProxy(url: string, seek?: number) {
  let attempts = 0
  while (attempts < 3) {
    try {
      return ytdl(url, {
        filter: "audioonly",
        // tslint:disable-next-line:no-bitwise
        highWaterMark: 1 << 25,
        quality: "highestaudio",
        begin: seek,
      })
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error)
    } finally {
      attempts++
    }
  }

  // return null if unsuccessful
  return null
}

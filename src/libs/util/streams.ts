import { Readable } from "stream"
import * as ytdl from "ytdl-core"
import _ from "lodash"

// async function initalizeSpotifyTrack(spotifyTrack: SpotifyTrack) {
//   const ytTracks = await createTracksFromSearchTerm(
//     `${spotifyTrack.title} - ${spotifyTrack.source === "spotify" ? spotifyTrack.artists : undefined}`,
//     1
//   )
//   const ytTrack = ytTracks[0]
//   spotifyTrack.url = ytTrack.url
//   spotifyTrack.initialized = true
// }

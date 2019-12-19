import Youtube from "./Youtube"
import { config } from "dotenv"

config()

const youtube = new Youtube(process.env.YOUTUBE_API_KEY)
const testPlaylistURL = "https://www.youtube.com/playlist?list=PLvBYUKNcXudIvs7QdZ2lAwiNJnvZNw4mp"
const testVideoURL = "https://www.youtube.com/watch?v=UelDrZ1aFeY"
const testVideoInfo = {
  source: "youtube",
  title: "The Beatles - Something",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY"
}
const testTrack: Track = {
  description:
    "Official site: http://www.thebeatles.com\n" +
    "Facebook: https://www.facebook.com/thebeatles/\n" +
    "Instagram: https://www.instagram.com/thebeatles\n" +
    "Twitter: https://twitter.com/thebeatles\n" +
    "\n" +
    "Music video by The Beatles performing Something. (C) 2015 Calderstone Productions Limited (a division of Universal Music Group) / Apple Films Ltd.",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY",
  source: "youtube",
  title: "The Beatles - Something"
}

it("can search for tracks", async () => {
  const results = await youtube.createTracksFromSearchTerm("something", 5)

  expect(results).toBeDefined()
  expect(results).toHaveLength(5)
})

it("can create track from url", async () => {
  const result = await youtube.createTrackFromURL(testVideoURL)

  expect(result).toBeDefined()
  expect(result).toEqual(expect.objectContaining(testVideoInfo))

  expect(youtube.createTrackFromURL("test")).rejects.toBeDefined()
})

it("can create playlist from playlistURL", async () => {
  const result = await youtube.createPlaylistFrom(testPlaylistURL)

  expect(result).toBeDefined()
  expect(result.tracks).toHaveLength(30)
  expect(result.name).toBe("Hip")
  expect(result.owner).toBe("Squall-E")
})

it("can validate youtube video URLs", () => {
  expect(youtube.isYoutubeVideo(testVideoURL)).toBeTruthy()

  expect(youtube.isYoutubeVideo("test")).toBeFalsy()
})

it("can validate youtube playlists URLs", () => {
  expect(youtube.isYoutubePlaylist(testPlaylistURL)).toBeTruthy()

  expect(youtube.isYoutubePlaylist("test")).toBeFalsy()
})

it("can create stream from track", async () => {
  const stream = await youtube.createReadableStreamFor(testTrack)
  expect(stream).toBeDefined()
})

import search from "youtube-search"
import _ from "lodash"
import request from "request"
import ytdl from "ytdl-core"
import { Track } from "../exported-types"

const youtubeBaseURL = "https://www.googleapis.com/youtube/v3"

export function isYoutubeVideo(term: string) {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(watch)\?(v)=([^\s&]+)[^\s]*($|\s)/g
  return term.match(regex)
}

export function isYoutubePlaylist(term: string) {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
  return term.match(regex)
}

export function createTracksFromSearchTerm(term: string, maxResults: number) {
  const key = process.env.YOUTUBE_API_KEY

  return new Promise<Track[]>((resolve, reject) => {
    if (maxResults <= 0 || maxResults > 50) {
      reject("Size of maxResults must be between 1 and 50")
    }

    search(term, { maxResults, key, type: "video" }).then(
      value => {
        const results = value.results
        if (results.length > 0) {
          const ytTracks: Track[] = []
          _.forEach(results, searchResult => {
            const thumbnail =
              searchResult.thumbnails.default || searchResult.thumbnails.standard || searchResult.thumbnails.high
            ytTracks.push({
              description: searchResult.description,
              publishedAt: searchResult.publishedAt,
              source: "youtube",
              title: searchResult.title,
              thumbnail: thumbnail.url,
              url: searchResult.link
            })
          })
          resolve(ytTracks)
        } else {
          reject("No results for search term.")
        }
      },
      reason => {
        reject(reason)
      }
    )
  })
}

export async function createTrackFromURL(url: string): Promise<Track> {
  const info = await ytdl.getInfo(url)

  return {
    description: info.description,
    url: info.video_url,
    source: "youtube",
    title: info.title,
    thumbnail: info.thumbnail_url
  }
}

export async function createTracksFromPlayList(playlistID: string): Promise<Playlist> {
  const key = process.env.YOUTUBE_API_KEY

  let requestURL = `${youtubeBaseURL}/playlistItems?part=snippet&playlistId=${playlistID}&maxResults=50&key=${key}`
  const collected: Track[] = []
  while (requestURL) {
    const resp = await new Promise<request.Response>((resolve, reject) => {
      request(requestURL, null, (error: any, response: request.RequestResponse, body: any) => {
        if (error) return reject(error)
        return resolve(response)
      })
    })
    if (resp.statusCode !== 200) throw new Error(`Code: ${resp.statusCode}`)
    const data = JSON.parse(resp.body)
    requestURL = !_.isNil(data.nextPageToken) ? `${youtubeBaseURL}&pageToken=${data.nextPageToken}` : null
    _.forEach(data.items, (song: any) => {
      const artwork = _.isNil(song.snippet.thumbnails)
        ? "http://beatmakerleague.com/images/No_Album_Art.png"
        : song.snippet.thumbnails.high.url
      const id = song.snippet.resourceId.videoId
      collected.push({
        publishedAt: song.snippet.publishedAt,
        source: "youtube",
        title: song.snippet.title,
        thumbnail: artwork,
        url: `https://www.youtube.com/watch?v=${id}`
      })
    })
  }
  return {
    name: "Youtube Playlist",
    tracks: collected
  }
}

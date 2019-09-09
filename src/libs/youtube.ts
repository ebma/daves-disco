import search, { YouTubeSearchResults } from "youtube-search"
import _ from "lodash"
import request from "request"
import ytdl from "ytdl-core"

const key = process.env.YOUTUBE_API_KEY
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
  return new Promise<YoutubeTrack[]>((resolve, reject) => {
    if (maxResults <= 0 || maxResults > 50) {
      reject("Size of maxResults must be between 1 and 50")
    }

    search(term, { maxResults, key }).then(
      value => {
        const results = value.results
        if (results.length > 0) {
          const ytTracks: YoutubeTrack[] = []
          _.forEach(results, searchResult => {
            const thumbnail =
              searchResult.thumbnails.default || searchResult.thumbnails.standard || searchResult.thumbnails.high
            const ytTrack = {
              title: searchResult.title,
              url: searchResult.link,
              thumbnail: thumbnail.url,
              description: searchResult.description,
              publishedAt: searchResult.publishedAt
            }
            ytTracks.push(ytTrack)
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

export async function createTrackFromURL(url: string):Promise<YoutubeTrack> {
  const info = await ytdl.getInfo(url)
  
  return {
    title: info.title,
    url: info.video_url,
    description: info.description,
    thumbnail: info.thumbnail_url
  }
}

export async function createTracksFromPlayList(playlistID: string) {
  let requestURL = `${youtubeBaseURL}/playlistItems?part=snippet&playlistId=${playlistID}&maxResults=50&key=${key}`
  const collected: YoutubeTrack[] = []
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
        title: song.snippet.title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: artwork,
        publishedAt: song.snippet.publishedAt
      })
    })
  }
  return collected
}

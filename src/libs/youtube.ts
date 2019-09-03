import search, { YouTubeSearchResults } from "youtube-search"
import _ from "lodash"
import request from "request"

export function createTracksFromSearchTerm(term: string, maxResults: number) {
  return new Promise<YoutubeTrack[]>((resolve, reject) => {
    if (maxResults <= 0 || maxResults > 50) {
      reject("Size of maxResults must be between 1 and 50")
    }

    search(term, { maxResults, key: process.env.YOUTUBE_API_KEY }).then(
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

export function isYoutubeVideo(term: string) {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(watch)\?(v)=([^\s&]+)[^\s]*($|\s)/g
  return term.match(regex)
}

export function isYoutubePlaylist(term: string) {
  const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
  return term.match(regex)
}

export async function createTracksFromPlayList() {
  if (_.isNil(this.parseData)) return []
  const type = this.parseData[0] === "v" ? 1 : 0
  const scope = { get: ["playlistItems", "videos"], id: ["playlistId", "id"], xtra: ["&maxResults=50", ""] }
  const base = `${this.YT_API}/${scope.get[type]}?part=snippet&${scope.id[type]}=${this.parseData[1]}${scope.xtra[type]}&key=${this.key}`
  const collected: YoutubeTrack[] = []
  let link = base
  while (link) {
    const resp = await new Promise<request.Response>((resolve, reject) => {
      request(link, null, (error: any, response: request.RequestResponse, body: any) => {
        if (error) return reject(error)
        return resolve(response)
      })
    })
    if (resp.statusCode !== 200) throw new Error(`Code: ${resp.statusCode}`)
    const data = JSON.parse(resp.body)
    link = !_.isNil(data.nextPageToken) ? `${base}&pageToken=${data.nextPageToken}` : null
    _.forEach(data.items, (song: any) => {
      const artwork = _.isNil(song.snippet.thumbnails)
        ? "http://beatmakerleague.com/images/No_Album_Art.png"
        : song.snippet.thumbnails.high.url
      const id = type ? song.id : song.snippet.resourceId.videoId
      collected.push({
        title: song.snippet.title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: artwork,
        publishedAt: null
      })
    })
  }
  return collected
}

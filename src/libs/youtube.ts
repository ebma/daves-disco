import search, { YouTubeSearchResults } from "youtube-search"
import _ from "lodash"

export function createTrackFromSearchTerm(term: string) {
  return new Promise<YoutubeTrack>((resolve, reject) => {
    search(term, { maxResults: 1, key: process.env.YOUTUBE_API_KEY }).then(
      value => {
        const results = value.results
        if (results.length > 0) {
          const searchResult = value.results[0]
          const thumbnail =
            searchResult.thumbnails.default || searchResult.thumbnails.standard || searchResult.thumbnails.high
          resolve({
            title: searchResult.title,
            url: searchResult.link,
            thumbnail: thumbnail.url,
            description: searchResult.description,
            publishedAt: searchResult.publishedAt
          })
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

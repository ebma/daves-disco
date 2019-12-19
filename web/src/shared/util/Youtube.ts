import _ from "lodash"
import search from "youtube-search"
import ytdl from "ytdl-core"
import ytpl from "ytpl"
import { trackError } from "./trackError"
import { Readable } from "stream"

class Youtube {
  private key: string

  constructor(apiKey: string) {
    this.key = apiKey
  }

  isYoutubeVideo(term: string): boolean {
    return ytdl.validateURL(term)
  }

  isYoutubePlaylist(term: string): boolean {
    const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
    const valid = term.match(regex)
    return valid ? true : false
  }

  createTracksFromSearchTerm(term: string, maxResults: number): Promise<Track[]> {
    return new Promise<Track[]>((resolve, reject) => {
      if (maxResults <= 0 || maxResults > 50) {
        reject("Size of maxResults must be between 1 and 50")
      }

      search(term, { maxResults, key: this.key, type: "video" }).then(
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
                thumbnail: thumbnail ? thumbnail.url : undefined,
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

  async createTrackFromURL(url: string): Promise<Track> {
    return new Promise<Track>(async (resolve, reject) => {
      try {
        const info = await this.getTrackInfo(url)

        if (info) {
          const track: Track = {
            description: info.description,
            url: info.video_url,
            source: "youtube",
            title: info.title,
            thumbnail: info.thumbnail_url
          }
          resolve(track)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  createPlaylistFrom(urlOrPlaylistID: string): Promise<Playlist> {
    return new Promise<Playlist>((resolve, reject) => {
      ytpl(urlOrPlaylistID, (error, result) => {
        if (error) {
          trackError(error)
          reject(error)
        } else {
          let tracks: Track[] = []
          _.forEach(result.items, item => {
            const newTrack: Track = { thumbnail: item.thumbnail, source: "youtube", title: item.title, url: item.url }
            tracks.push(newTrack)
          })

          resolve({ name: result.title, owner: result.author.name, tracks })
        }
      })
    })
  }

  createReadableStreamFor(track: Track): Promise<Readable> {
    return new Promise<Readable>(async (resolve, reject) => {
      if (!track.url) {
        reject(`Track ${track.title} doesn't have an url`)
      } else {
        const stream = ytdl(track.url, { quality: "highestaudio", filter: "audioonly" }).on("error", reject)
        resolve(stream)
      }
    })
  }

  private async getTrackInfo(trackURL: string): Promise<ytdl.videoInfo> {
    return new Promise<ytdl.videoInfo>(async (resolve, reject) => {
      try {
        const info = await ytdl.getInfo(trackURL)
        resolve(info)
      } catch (error) {
        trackError(`Error occured while fetching trackInfo for '${trackURL}': ${error}`)
      }

      try {
        const info = await ytdl.getBasicInfo(trackURL)
        resolve(info)
      } catch (error) {
        reject(`Couldn't get info for track '${trackURL}' because: ${error}`)
      }
    })
  }
}

export default Youtube

import _ from "lodash"
import config from "../utils/config"
import { Readable } from "stream"
import search from "youtube-search"
import ytdl from "ytdl-core"
import ytdlDiscord from "ytdl-core-discord"
import ytpl from "ytpl"
import { trackError } from "../utils/trackError"
import { SpotifyHelper } from "../shared/utils/helpers"

export class Youtube {
  private key: string

  constructor(apiKey: string) {
    if (!apiKey) throw new Error("YouTube API key cannot be undefined!")
    this.key = apiKey
  }

  isYoutubeVideo(url: string): boolean {
    return ytdl.validateURL(url)
  }

  describesYoutubePlaylist(term: string): boolean {
    const regex = /(^|\s)(https?:\/\/)?(www\.)?youtube\.com\/(playlist)\?(list)=([^\s&]+)[^\s]*($|\s)/g
    const valid = term.match(regex)
    return valid ? true : false
  }

  isYoutubePlaylist(playlist: Playlist): playlist is YoutubePlaylist {
    return playlist.source === "youtube"
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
                id: searchResult.id,
                publishedAt: searchResult.publishedAt,
                source: "youtube",
                title: searchResult.title,
                thumbnail: { medium: thumbnail ? thumbnail.url : undefined },
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

  private getThumbnailFromInfo(info: ytdl.videoInfo): Thumbnail {
    if (info.thumbnail_url) {
      return { medium: info.thumbnail_url }
    } else {
      const thumbnails = info.player_response?.videoDetails?.thumbnail?.thumbnails
      if (thumbnails) {
        return {
          small: thumbnails[0]?.url,
          medium: thumbnails[1]?.url,
          large: thumbnails[thumbnails.length - 1]?.url
        }
      } else {
        return {}
      }
    }
  }

  async createTrackFromURL(url: string): Promise<Track> {
    return new Promise<Track>(async (resolve, reject) => {
      try {
        const info = await this.getTrackInfo(url)

        if (info) {
          const track: Track = {
            id: info.video_id,
            description: info.description,
            url: info.video_url,
            source: "youtube",
            title: info.title,
            thumbnail: this.getThumbnailFromInfo(info)
          }
          resolve(track)
        } else {
          reject(`Could not get info for url ${url}`)
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
          trackError(error, "Youtube.createPlaylistFrom")
          reject(error)
        } else {
          let tracks: Track[] = []
          _.forEach(result.items, item => {
            const newTrack: Track = {
              id: item.id,
              thumbnail: { medium: item.thumbnail },
              source: "youtube",
              title: item.title,
              url: item.url
            }
            tracks.push(newTrack)
          })

          resolve({
            id: result.id,
            name: result.title,
            owner: result.author.name,
            source: "youtube",
            tracks,
            url: result.url
          })
        }
      })
    })
  }

  createReadableStreamFor(track: Track): Promise<Readable> {
    return new Promise<Readable>(async (resolve, reject) => {
      if (!track.url) {
        reject(`Track ${track.title} doesn't have an url`)
      } else if (!this.isYoutubeVideo(track.url)) {
        reject(`Track has an invalid url '${track.url}'`)
      } else {
        ytdlDiscord(track.url, { quality: "highestaudio", filter: "audioonly", highWaterMark: 1 << 25 }) // fuck this shit (https://github.com/fent/node-ytdl-core/issues/402#issuecomment-538070017)
          .then(resolve)
          .catch(reject)
      }
    })
  }

  async completePartialTrack(track: Track): Promise<boolean> {
    let searchTerm = track.title
    if (SpotifyHelper.isSpotifyTrack(track)) {
      searchTerm = `${track.title} - ${track.artists}`
    }

    const results = await this.createTracksFromSearchTerm(searchTerm, 1)
    const equivYoutubeTrack = results.length > 0 ? results[0] : null
    if (equivYoutubeTrack) {
      track.url = equivYoutubeTrack.url
      track.thumbnail = track.thumbnail ? track.thumbnail : equivYoutubeTrack.thumbnail
      track.publishedAt = equivYoutubeTrack.publishedAt
      track.description = equivYoutubeTrack.description
      return true
    } else {
      return false
    }
  }

  private async getTrackInfo(trackURL: string): Promise<ytdl.videoInfo> {
    return new Promise<ytdl.videoInfo>(async (resolve, reject) => {
      try {
        const info = await ytdl.getInfo(trackURL)
        resolve(info)
      } catch (error) {
        trackError(`Error occured while fetching trackInfo for '${trackURL}': ${error}`, "Youtube.getTrackInfo()")
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

const GlobalInstance = new Youtube(config.YOUTUBE_API_KEY)

export default GlobalInstance
import _ from "lodash"
import { Readable } from "stream"
import search from "ytsr"
import ytdl from "@distube/ytdl-core"
import ytpl from "ytpl"
import { trackError } from "../utils/trackError"
import { SpotifyHelper } from "../shared/utils/helpers"
import { downloadVideoWithProxy } from "./video-download"

export class Youtube {
  isYoutubeVideo(url: string): boolean {
    return ytdl.validateURL(url)
  }

  describesYoutubePlaylist(term: string): boolean {
    return ytpl.validateID(term)
  }

  isYoutubePlaylist(playlist: Playlist): playlist is YoutubePlaylist {
    return playlist.source === "youtube"
  }

  createTracksFromSearchTerm(term: string, maxResults: number): Promise<Track[]> {
    return new Promise<Track[]>((resolve, reject) => {
      if (maxResults <= 0 || maxResults > 50) {
        reject("Size of maxResults must be between 1 and 50")
      }

      search(term, { limit: maxResults }).then(
        async (value) => {
          const results = value.items
          if (results.length > 0) {
            const urls = results
              .map((result) => {
                if (result.type === "video") {
                  return result.url
                } else {
                  return undefined
                }
              })
              .filter((url) => url !== undefined)
            const tracks = await Promise.all(urls.map((url) => this.createTrackFromURL(url)))
            resolve(tracks)
          } else {
            reject("No results for search term.")
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  }

  fastSearch(term: string, maxResults: number): Promise<TrackSearchResult[]> {
    return new Promise<TrackSearchResult[]>((resolve, reject) => {
      if (maxResults <= 0 || maxResults > 50) {
        reject("Size of maxResults must be between 1 and 50")
      }

      search(term, { limit: maxResults }).then(
        async (value) => {
          const results = value.items
          if (results.length > 0) {
            const trackSearchResults: TrackSearchResult[] = results
              .map((result) => {
                if (result.type === "video") {
                  return {
                    title: result.title,
                    url: result.url,
                  }
                } else return undefined
              })
              .filter((result) => result !== undefined)
            resolve(trackSearchResults)
          } else {
            reject("No results for search term.")
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  }

  private getThumbnailFromInfo(info: ytdl.videoInfo): Thumbnail {
    if (info.thumbnail_url) {
      return { medium: info.thumbnail_url }
    } else {
      const thumbnails = info.player_response?.videoDetails?.thumbnails
      if (thumbnails) {
        return {
          small: thumbnails[0]?.url,
          medium: thumbnails[1]?.url,
          large: thumbnails[thumbnails.length - 1]?.url,
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
            description: info.videoDetails.description,
            identifier: info.videoDetails.videoId,
            url: info.videoDetails.video_url,
            source: "youtube",
            title: info.videoDetails.title,
            thumbnail: this.getThumbnailFromInfo(info),
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
    return new Promise<Playlist>(async (resolve, reject) => {
      try {
        const playlist = await ytpl(urlOrPlaylistID)
        const tracks: Track[] = []
        _.forEach(playlist.items, (item) => {
          const newTrack: Track = {
            identifier: item.id,
            thumbnail: { medium: item.bestThumbnail.url },
            source: "youtube",
            title: item.title,
            url: item.url,
          }
          tracks.push(newTrack)
        })

        resolve({
          identifier: playlist.id,
          name: playlist.title,
          owner: playlist.author.name,
          source: "youtube",
          tracks,
          url: playlist.url,
        })
      } catch (error) {
        trackError(error, "Youtube.createPlaylistFrom")
        reject(error)
      }
    })
  }

  createReadableStreamFor(track: Track, seek?: number): Promise<Readable> {
    return new Promise<Readable>(async (resolve, reject) => {
      if (!track.url) {
        reject(`Track ${track.title} doesn't have an url`)
      } else if (!this.isYoutubeVideo(track.url)) {
        reject(`Track has an invalid url '${track.url}'`)
      } else {
        const stream = downloadVideoWithProxy(track.url, seek)
        if (stream) {
          resolve(stream)
        } else {
          reject(`Could not create stream for track ${track.url}`)
        }
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

const GlobalInstance = new Youtube()

export default GlobalInstance

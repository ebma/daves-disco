import { StreamDispatcher, VoiceConnection } from "discord.js"
import { Observable } from "rxjs"
import { trackError } from "../shared/util/trackError"
import Youtube from "../shared/util/Youtube"

class StreamManager {
  private voiceConnection: VoiceConnection
  private dispatcher?: StreamDispatcher
  private volume: number = 0.1

  constructor(voiceConnection: VoiceConnection) {
    this.voiceConnection = voiceConnection
  }

  setVolume(volume: number) {
    if (volume < 0 || volume > 100) {
      throw new Error("Invalid volume! Choose a number between 0-100%")
    }
    this.volume = volume / 100
    if (this.dispatcher) {
      this.dispatcher.setVolume(this.volume)
    }
  }

  getVolume() {
    return this.volume * 100
  }

  get paused(): boolean {
    return Boolean(this.dispatcher && this.dispatcher.paused)
  }

  get playing(): boolean {
    return Boolean(this.dispatcher)
  }

  pause() {
    if (!this.dispatcher) {
      throw new Error("Can't pause before starting to play something.")
    } else if (this.dispatcher.paused) {
      throw new Error("Stream paused already.")
    } else {
      this.dispatcher.pause()
    }
  }

  resume() {
    if (!this.dispatcher) {
      throw new Error("Can't resume before starting to play something.")
    } else if (!this.dispatcher.paused) {
      throw new Error("Stream running already.")
    } else {
      this.dispatcher.resume()
    }
  }

  async playTrack(track: Track) {
    try {
      if (!track.url) {
        const success = await Youtube.completePartialTrack(track)
        if (!success) {
          throw new Error(`Could not get complete information about track ${track.title}!`)
        }
      }

      const stream = await Youtube.createReadableStreamFor(track)
      const dispatcher = this.voiceConnection.play(stream, { volume: this.volume, highWaterMark: 12 })
      this.dispatcher = dispatcher

      return new Observable<StreamManagerObservableMessage>(subscriber => {
        dispatcher
          .on("debug", info => subscriber.next({ type: "debug", data: info }))
          .on("start", () => subscriber.next({ type: "start" }))
          .on("finish", () => {
            stream.destroy()
            this.dispatcher = null
            subscriber.next({ type: "finish" })
          })
          .on("error", (error: any) => {
            trackError(error, "StreamManager.playTrack error")
            stream.destroy()
            this.dispatcher = null
            subscriber.next({ type: "error", data: error && error.message ? error.message : error })
          })
      })
    } catch (error) {
      trackError(error)
    }
  }

  endCurrent() {
    if (this.dispatcher && !this.dispatcher.writableFinished) {
      this.dispatcher.end()
    }
  }

  stop() {
    if (this.dispatcher && !this.dispatcher.destroyed) {
      this.dispatcher.destroy()
    }
  }

  disconnect() {
    this.stop()
    this.dispatcher = null
    this.voiceConnection.disconnect()
  }
}

export default StreamManager

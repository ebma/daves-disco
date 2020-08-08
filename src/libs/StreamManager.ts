import { StreamDispatcher, VoiceConnection } from "discord.js"
import { get as httpGet, IncomingMessage } from "http"
import { get as httpsGet } from "https"
import { PartialObserver, Subject } from "rxjs"
import { Readable } from "stream"
import Youtube from "../libs/Youtube"
import { trackError } from "../utils/trackError"

class StreamManager {
  private voiceConnection: VoiceConnection
  private musicDispatcher?: StreamDispatcher
  private streamSource?: Readable | Track
  private volume: number = 0.1
  private subject: Subject<StreamManagerObservableMessage>

  constructor(voiceConnection: VoiceConnection) {
    this.voiceConnection = voiceConnection
    this.subject = new Subject()
  }

  setVolume(volume: number) {
    if (volume < 0 || volume > 100) {
      throw new Error("Invalid volume! Choose a number between 0-100%")
    }
    this.volume = volume / 100
    if (this.musicDispatcher) {
      this.musicDispatcher.setVolume(this.volume)
    }
  }

  getVolume() {
    return this.volume * 100
  }

  get paused(): boolean {
    return Boolean(this.musicDispatcher && this.musicDispatcher.paused)
  }

  get playing(): boolean {
    return Boolean(this.musicDispatcher)
  }

  pause() {
    if (!this.musicDispatcher) {
      throw new Error("Can't pause before starting to play something.")
    } else if (this.musicDispatcher.paused) {
      throw new Error("Stream paused already.")
    } else {
      this.musicDispatcher.pause(true)
    }
  }

  resume() {
    if (!this.musicDispatcher) {
      throw new Error("Can't resume before starting to play something.")
    } else if (!this.musicDispatcher.paused) {
      throw new Error("Stream running already.")
    } else {
      this.musicDispatcher.resume()
    }
  }

  async playSound(source: string, volume: number) {
    const vol = volume / 100 // need's to be between 0 and 100
    const trackPaused = this.paused
    const resourceGetter = source.startsWith("https:") ? httpsGet : httpGet
    try {
      resourceGetter(source, result => {
        if (this.streamSource instanceof Readable) this.streamSource.unpipe() // unpipe because otherwise the stream will not work with the next voice connection
        const soundDispatcher = this.voiceConnection.play(result, { highWaterMark: 512, volume: vol })
        soundDispatcher
          .on("finish", () => {
            if (this.streamSource) {
              this.play(this.streamSource, trackPaused)
            }
          })
          .on("error", (error: any) => {
            trackError(error, "StreamManager.playSound error")
          })
      })
    } catch (error) {
      trackError(error)
    }
  }

  async play(input: Track | Readable, trackPaused: boolean = false) {
    try {
      let dispatcher: StreamDispatcher = null
      if (input instanceof Readable) {
        dispatcher = await this.playReadable(input)
      } else {
        if (input.source === "radio") {
          this.musicDispatcher = null // set to null before because of weird behaviour of 'dispatcher.end/finish'
          dispatcher = await this.playUnknown(input)
        } else {
          dispatcher = await this.playYoutube(input)
        }
      }

      if (trackPaused) dispatcher.pause()
      this.musicDispatcher = dispatcher
    } catch (error) {
      trackError(error)
    }
  }

  private async playYoutube(input: Track) {
    const source = await Youtube.createReadableStreamFor(input)
    this.streamSource = source

    const dispatcher = this.voiceConnection.play(source, {
      volume: this.volume,
      highWaterMark: 512,
      type: "opus"
    })

    dispatcher
      .on("debug", info => this.subject.next({ type: "debug", data: info }))
      .on("start", () => this.subject.next({ type: "start" }))
      .on("finish", () => {
        // check if this is still the current/only one
        if (this.musicDispatcher === dispatcher) {
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "finish" })
        }
      })
      .on("error", (error: any) => {
        if (this.musicDispatcher === dispatcher) {
          if (source instanceof Readable) source.destroy()
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playYoutube error")
      })
    return dispatcher
  }

  private async playUnknown(input: Track) {
    const resourceGetter = input.url.startsWith("https:") ? httpsGet : httpGet
    const stream: Readable = await new Promise(resolve => {
      resourceGetter(input.url, result => {
        resolve(result)
      })
    })

    this.streamSource = input

    const dispatcher = this.voiceConnection.play(stream, {
      volume: this.volume,
      highWaterMark: 512
    })

    dispatcher
      .on("debug", info => this.subject.next({ type: "debug", data: info }))
      .on("start", () => this.subject.next({ type: "start" }))
      .on("finish", () => {
        // check if this is still the current/only one
        if (this.musicDispatcher === dispatcher) {
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "finish" })
        }
      })
      .on("error", (error: any) => {
        if (this.musicDispatcher === dispatcher) {
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playUnknown error")
      })
    return dispatcher
  }

  private async playReadable(input: Readable) {
    this.streamSource = input
    const dispatcher = this.voiceConnection.play(input, {
      volume: this.volume,
      highWaterMark: 512,
      type: "opus"
    })

    dispatcher
      .on("debug", info => this.subject.next({ type: "debug", data: info }))
      .on("start", () => this.subject.next({ type: "start" }))
      .on("finish", () => {
        // check if this is still the current/only one
        if (this.musicDispatcher === dispatcher) {
          input.destroy()
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "finish" })
        }
      })
      .on("error", (error: any) => {
        if (this.musicDispatcher === dispatcher) {
          input.destroy()
          this.streamSource = null
          this.musicDispatcher = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playReadable error")
      })

    return dispatcher
  }

  subscribe(subscriber: PartialObserver<StreamManagerObservableMessage>) {
    return this.subject.subscribe(subscriber)
  }

  endCurrent() {
    if (this.musicDispatcher && !this.musicDispatcher.writableFinished) {
      this.musicDispatcher.end()
    }
  }

  stop() {
    if (this.musicDispatcher && !this.musicDispatcher.destroyed) {
      this.musicDispatcher.destroy()
    }
  }

  disconnect() {
    this.stop()
    this.musicDispatcher = null
    this.voiceConnection.disconnect()
  }
}

export default StreamManager

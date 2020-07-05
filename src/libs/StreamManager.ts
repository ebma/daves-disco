import { StreamDispatcher, VoiceConnection } from "discord.js"
import { get as httpGet } from "http"
import { get as httpsGet } from "https"
import { PartialObserver, Subject } from "rxjs"
import { Readable } from "stream"
import Youtube from "../libs/Youtube"
import { trackError } from "../utils/trackError"

class StreamManager {
  private voiceConnection: VoiceConnection
  private dispatcher?: StreamDispatcher
  private stream?: Readable
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
      this.dispatcher.pause(true)
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

  async playSound(source: string, volume: number) {
    const vol = volume / 100 // need's to be between 0 and 100
    const resourceGetter = source.startsWith("https:") ? httpsGet : httpGet
    try {
      resourceGetter(source, result => {
        this.dispatcher = null
        this.stream?.unpipe() // unpipe because otherwise the stream will not work with the next voice connection
        const soundDispatcher = this.voiceConnection.play(result, { highWaterMark: 512, volume: vol })
        this.dispatcher = soundDispatcher
        soundDispatcher
          .on("finish", () => {
            if (this.stream) {
              this.playTrack(this.stream)
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

  async playTrack(input: Track | Readable) {
    try {
      const stream = input instanceof Readable ? input : await Youtube.createReadableStreamFor(input)
      this.stream = stream
      const dispatcher = this.voiceConnection.play(stream, {
        volume: this.volume,
        highWaterMark: 512,
        type: "opus"
      })
      this.dispatcher = dispatcher
      dispatcher
        .on("debug", info => this.subject.next({ type: "debug", data: info }))
        .on("start", () => this.subject.next({ type: "start" }))
        .on("finish", () => {
          // check if this is still the current/only one
          if (this.dispatcher === dispatcher) {
            stream.destroy()
            this.stream = null
            this.dispatcher = null
            this.subject.next({ type: "finish" })
          }
        })
        .on("error", (error: any) => {
          if (this.dispatcher === dispatcher) {
            stream.destroy()
            this.stream = null
            this.dispatcher = null
            this.subject.next({ type: "error", data: error && error.message ? error.message : error })
          }
          trackError(error, "StreamManager.playTrack error")
        })
    } catch (error) {
      trackError(error)
    }
  }

  subscribe(subscriber: PartialObserver<StreamManagerObservableMessage>) {
    return this.subject.subscribe(subscriber)
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

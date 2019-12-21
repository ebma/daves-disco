import { Readable } from "stream"
import Youtube from "../shared/util/Youtube"

export interface Dispatcher {
  destroyed: boolean
  passes: number
  paused: boolean
  volume: number
  end(reason?: string): void
  pause(): void
  resume(): void
  setVolume(volume: number): void

  on(event: "debug", listener: (information: string) => void): this
  on(event: "end", listener: (reason: string) => void): this
  on(event: "error", listener: (err: Error) => void): this
  on(event: "speaking", listener: (value: boolean) => void): this
  on(event: "start", listener: () => void): this
  on(event: "volumeChange", listener: (oldVolume: number, newVolume: number) => void): this
  on(event: string, listener: Function): this

  once(event: "debug", listener: (information: string) => void): this
  once(event: "end", listener: (reason: string) => void): this
  once(event: "error", listener: (err: Error) => void): this
  once(event: "speaking", listener: (value: boolean) => void): this
  once(event: "start", listener: () => void): this
  once(event: "volumeChange", listener: (oldVolume: number, newVolume: number) => void): this
  once(event: string, listener: Function): this
}

interface Options {
  seek?: number
  volume?: number
  passes?: number
}
class StreamManager {
  private createStream: (stream: Readable, options?: Options) => Dispatcher
  private dispatcher?: Dispatcher
  private volume: number = 0.1

  constructor(createStream: (stream: Readable, options?: Options) => Dispatcher) {
    this.createStream = createStream
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

  playTrack(track: Track): Promise<Dispatcher> {
    return new Promise<Dispatcher>(async (resolve, reject) => {
      try {
        const stream = await Youtube.createReadableStreamFor(track)
        const dispatcher = this.createStream(stream, { seek: 0, volume: this.volume, passes: 3 })
        dispatcher
          .once("end", () => {
            stream.destroy()
            this.dispatcher = null
          })
          .once("error", () => {
            stream.destroy()
            this.dispatcher = null
          })

        this.dispatcher = dispatcher
        resolve(dispatcher)
      } catch (error) {
        const errorMessage = `Could not start stream for track '${track.title}: ${error}`
        reject(errorMessage)
      }
    })
  }

  stopPlaying() {
    if (this.dispatcher) {
      this.dispatcher.end("forceStop")
    }
  }

  disconnect() {
    if (this.dispatcher) {
      this.dispatcher.end()
      this.dispatcher = null
    }
  }
}

export default StreamManager

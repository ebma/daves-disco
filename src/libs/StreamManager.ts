import Youtube from "../shared/util/Youtube"

class StreamManager {
  private streamHolder: StreamHolder
  private dispatcher?: Dispatcher
  private volume: number = 0.1

  constructor(streamHolder: StreamHolder) {
    this.streamHolder = streamHolder
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
        const dispatcher = this.streamHolder.playStream(stream, { seek: 0, volume: this.volume, passes: 3 })
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
        reject(error)
      }
    })
  }

  skip() {
    if (this.dispatcher) {
      this.dispatcher.end("skip")
    }
  }

  stop() {
    if (this.dispatcher) {
      this.dispatcher.end("forceStop")
    }
  }

  disconnect() {
    if (this.dispatcher) {
      this.dispatcher.end()
      this.dispatcher = null
    }
    this.streamHolder.disconnect()
  }
}

export default StreamManager

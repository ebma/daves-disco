import _ from "lodash"
import { PartialObserver, Subject, Subscription } from "rxjs"
import { trackError } from "../shared/util/trackError"
import ObservableQueue from "./ObservableQueue"
import StreamManager from "./StreamManager"

class MusicPlayer {
  destroyed = false
  queue: ObservableQueue<Track>
  private streamManager: StreamManager
  private subject: Subject<MusicPlayerSubjectMessage>
  private playingTrack: Track

  constructor(streamManager: StreamManager) {
    this.streamManager = streamManager
    this.queue = new ObservableQueue<Track>()
    this.subject = new Subject<MusicPlayerSubjectMessage>()

    this.queue.subscribe((currentTrack, currentQueue) => {
      if (currentTrack !== this.playingTrack) {
        streamManager.endCurrent()
        if (currentTrack) {
          this.startStreaming(currentTrack)
        }
        this.playingTrack = currentTrack
      }
      this.subject.next({ messageType: "status", message: "current-track", data: currentTrack })
      this.subject.next({ messageType: "status", message: "current-queue", data: currentQueue })
    })
  }

  get paused() {
    return this.streamManager.paused
  }

  get playing() {
    return this.streamManager.playing
  }

  get remainingTracks() {
    return this.queue.getRemaining()
  }

  get currentTrack() {
    return this.queue.getCurrent()
  }

  get volume() {
    return this.streamManager.getVolume()
  }

  setVolume(newVol: number) {
    try {
      this.streamManager.setVolume(newVol)
      this.subject.next({ messageType: "status", message: "volume", data: newVol })
    } catch (error) {
      this.subject.next({ messageType: "error", message: error })
    }
  }

  enqueue(track: Track) {
    this.queue.addElement(track)
  }

  enqueueAll(tracks: Track[]) {
    this.queue.addAll(tracks)
  }

  clear() {
    this.queue.clear()
    if (_.isNil(this.queue.getCurrent())) {
      this.subject.next({ messageType: "status", message: "idle" })
    }
  }

  pauseStream() {
    try {
      this.streamManager.pause()
      this.subject.next({ messageType: "status", message: "paused" })
    } catch (error) {
      this.subject.next({ messageType: "error", message: error.message })
    }
  }

  resumeStream() {
    if (this.streamManager.paused) {
      try {
        this.streamManager.resume()
        this.subject.next({ messageType: "status", message: "resumed" })
      } catch (error) {
        this.subject.next({ messageType: "error", message: error.message })
      }
    } else if (this.remainingTracks.length > 0) {
      this.startStreaming(this.playingTrack)
    }
  }

  destroy() {
    this.subject.next({ messageType: "info", message: "Stopping stream." })
    this.subject.next({ messageType: "status", message: "current-track", data: undefined })
    this.subject.next({ messageType: "status", message: "current-queue", data: [] })
    this.queue.clear()
    this.streamManager.stop()
    this.streamManager.disconnect()
    this.destroyed = true
  }

  shuffle() {
    this.queue.shuffle()
  }

  skipForward(amount: number = 1) {
    this.queue.moveForward(amount)
  }

  skipPrevious(amount: number = 1) {
    this.queue.moveBack(amount)
  }

  updateQueue(newItems: Track[]) {
    const currentItem = this.queue.getCurrent()

    const foundIndex = newItems.findIndex(track => track.trackID === currentItem.trackID)
    const newIndex = foundIndex !== -1 ? foundIndex : 0

    this.queue.replace(newItems, newIndex)
  }

  private async startStreaming(track: Track) {
    try {
      const streamObservable = await this.streamManager.playTrack(track)
      streamObservable.subscribe({
        next: message => this.observeStream(message, track)
      })
    } catch (error) {
      const errorMessage = `Could not start stream for track '${track.title}': ${error}`
      trackError(errorMessage, "MusicPlayer.startStreaming try-catch-error")
      this.subject.next({ messageType: "error", message: errorMessage })
    }
  }

  subscribe(observer: PartialObserver<MusicPlayerSubjectMessage>): Subscription {
    return this.subject.subscribe(observer)
  }

  private observeStream(message: StreamManagerObservableMessage, track: Track) {
    switch (message.type) {
      case "debug":
        console.log("observeStream debug info: ", message.data)
        this.subject.next({ messageType: "info", message: `Debug Info: ${message.data}` })
      case "start":
        this.subject.next({ messageType: "status", message: "playing" })
        this.subject.next({ messageType: "status", message: "volume", data: this.volume })
        this.subject.next({
          messageType: "info",
          message: `Let me see your hands while I play *${track.title}* :raised_hands:`
        })
        break
      case "finish":
        this.subject.next({ messageType: "info", message: `Played: *${track.title}*` })

        if (_.isNil(this.queue.getCurrent())) {
          this.subject.next({ messageType: "status", message: "idle" })
        } else if (track === this.playingTrack) {
          this.skipForward()
        }

        break
      case "error":
        const error = message.data
        trackError(error, "MusicPlayer.startStreaming on-dispatcher-error")
        this.subject.next({ messageType: "error", message: error.message })
        break
    }
  }
}

export default MusicPlayer

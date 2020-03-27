import _ from "lodash"
import { Subject, PartialObserver, Subscription } from "rxjs"
import { trackError } from "../shared/util/trackError"
import ObservableQueue from "./ObservableQueue"
import StreamManager from "./StreamManager"

class MusicPlayer {
  destroyed = false
  queue: ObservableQueue<Track>
  private streamManager: StreamManager
  private subject: Subject<MusicPlayerSubjectMessage>
  private startPending = false

  constructor(streamManager: StreamManager) {
    this.streamManager = streamManager
    this.queue = new ObservableQueue<Track>()
    this.subject = new Subject<MusicPlayerSubjectMessage>()

    this.queue.subscribe((currentTrack, currentQueue) => {
      if (currentTrack && !this.startPending && !this.streamManager.playing && !this.paused) {
        this.startStreaming(currentTrack)
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
      this.startStreaming(this.currentTrack)
    }
  }

  destroy() {
    this.subject.next({ messageType: "info", message: "Stopping stream." })
    this.subject.next({ messageType: "status", message: "current-track", data: undefined })
    this.subject.next({ messageType: "status", message: "current-queue", data: [] })
    this.streamManager.stop()
    this.streamManager.disconnect()
    this.destroyed = true
  }

  shuffle() {
    this.queue.shuffle()
  }

  skipForward(amount: number = 1) {
    this.streamManager.skip()
    this.queue.moveForward(amount)
  }

  skipPrevious(amount: number = 1) {
    this.streamManager.skip()
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
      this.startPending = true
      const dispatcher = await this.streamManager.playTrack(track)
      dispatcher
        .once("start", () => {
          this.startPending = false
          this.subject.next({ messageType: "status", message: "playing" })
          this.subject.next({ messageType: "status", message: "volume", data: this.volume })
          this.subject.next({
            messageType: "info",
            message: `Let me see your hands while I play *${track.title}* :raised_hands:`
          })
        })
        .once("finish", (reason: Error | null) => {
          if (reason?.message !== "forceStop") {
            if (reason?.message !== "skip") {
              this.subject.next({ messageType: "info", message: `Played: *${track.title}*` })
              this.queue.moveForward()
            }
          }

          if (_.isNil(this.queue.getCurrent())) {
            this.subject.next({ messageType: "status", message: "idle" })
          }
        })
        .on("error", e => {
          trackError(e, "MusicPlayer.startStreaming on-dispatcher-error")
          this.subject.next({ messageType: "error", message: e.message })
        })
    } catch (error) {
      this.startPending = false
      const errorMessage = `Could not start stream for track '${track.title}': ${error}`
      trackError(errorMessage, "MusicPlayer.startStreaming try-catch-error")
      this.subject.next({ messageType: "error", message: errorMessage })
    }
  }

  subscribe(observer: PartialObserver<MusicPlayerSubjectMessage>): Subscription {
    return this.subject.subscribe(observer)
  }
}

export default MusicPlayer

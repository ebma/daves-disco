import _ from "lodash"
import { PartialObserver, Subject, Subscription } from "rxjs"
import { updateTrackModel } from "../db/models/helper"
import Track from "../db/models/track"
import { trackError } from "../utils/trackError"
import ObservableQueue from "./ObservableQueue"
import StreamManager from "./StreamManager"
import VoiceModerator from "./VoiceModerator"
import Youtube from "./Youtube"
import { v4 as uuidv4 } from "uuid"

function createQueuedTrack(trackModelID: TrackModelID): QueuedTrack {
  return { trackModelID, uuid: uuidv4() }
}

function createQueuedTrackModel(trackModel: TrackModel): QueuedTrackModel {
  return {
    trackModel,
    uuid: uuidv4()
  }
}

class MusicPlayer {
  destroyed = false
  queue: ObservableQueue<QueuedTrack>
  private streamManager: StreamManager
  private streamSubscription: Subscription
  private subject: Subject<MusicPlayerSubjectMessage>
  private playingTrack?: QueuedTrackModel
  private voiceModerator: VoiceModerator

  constructor(streamManager: StreamManager) {
    this.streamManager = streamManager
    this.queue = new ObservableQueue<QueuedTrack>()
    this.subject = new Subject<MusicPlayerSubjectMessage>()
    this.voiceModerator = new VoiceModerator(this)
    this.voiceModerator.init()

    this.queue.subscribeCurrentElement(async currentTrack => {
      if (!currentTrack) {
        this.playingTrack = null
        streamManager.endCurrent()
      } else if (
        currentTrack.trackModelID !== this.playingTrack?.trackModel._id.toString() ||
        currentTrack.uuid !== this.playingTrack?.uuid ||
        this.queue.loopState !== "none"
      ) {
        const currentTrackModel = await Track.findById(currentTrack?.trackModelID)
        if (currentTrackModel) {
          this.playingTrack = createQueuedTrackModel(currentTrackModel.toJSON())
          // it's important to change playingTrack before ending the current song
          streamManager.endCurrent()
          this.startStreaming(this.playingTrack)
        } else {
          this.playingTrack = null
          streamManager.endCurrent()
        }
      }
      this.subject.next({ messageType: "status", message: "current-track", data: currentTrack })
    })

    this.queue.subscribeQueue(currentQueue => {
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

  enqueue(track: TrackModel) {
    this.queue.addElement(createQueuedTrack(track._id.toString()))
  }

  enqueueAll(tracks: TrackModel[]) {
    this.queue.addAll(tracks.map(track => createQueuedTrack(track._id.toString())))
  }

  muteModerator() {
    this.voiceModerator.kill()
  }

  unmuteModerator() {
    this.voiceModerator.init()
  }

  clear() {
    // clear everything except current track to not stop the current track
    const currentTrack = this.currentTrack
    this.updateQueue([currentTrack])
  }

  playSound(source: string, volume: number) {
    this.streamManager.playSound(source, volume)
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
    const currentItem = this.queue.getCurrent()
    const shuffledItemList = _.shuffle(this.queue.getAll().filter(value => value !== currentItem))

    shuffledItemList.unshift(currentItem)

    this.queue.replace(shuffledItemList, 0)
  }

  skipForward(amount: number = 1, force: boolean = false) {
    this.queue.moveForward(amount, force)
  }

  skipPrevious(amount: number = 1) {
    this.queue.moveBack(amount)
  }

  setLoopState(state: LoopState) {
    this.queue.loopState = state
    this.subject.next({ messageType: "status", message: "loop-state-changed" })
  }

  updateQueue(newItems: QueuedTrack[]) {
    const currentItem = this.queue.getCurrent()

    const foundIndex = newItems.findIndex(
      track => track.trackModelID === currentItem.trackModelID && track.uuid === currentItem.uuid
    )
    const newIndex = foundIndex !== -1 ? foundIndex : 0

    this.queue.replace(newItems, newIndex)
  }

  private async startStreaming(queuedTrack: QueuedTrackModel) {
    const track = queuedTrack.trackModel
    try {
      if (!track.url) {
        const success = await Youtube.completePartialTrack(track)
        updateTrackModel(track)
        if (!success) {
          throw new Error(`Could not get complete information about track ${track.title}!`)
        }
      }
      this.streamManager.play(track)
      this.streamSubscription?.unsubscribe()
      this.streamSubscription = this.streamManager.subscribe({
        next: message => this.observeStream(message, queuedTrack)
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

  private observeStream(message: StreamManagerObservableMessage, queuedTrack: QueuedTrackModel) {
    const track = queuedTrack.trackModel
    console.log("observeStream message: ", message);
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
        console.log("in observeStream finish: ", message.data)
        this.subject.next({ messageType: "info", message: `Played: *${track.title}*` })

        if (_.isNil(this.queue.getCurrent())) {
          this.subject.next({ messageType: "status", message: "idle" })
        } else if (
          queuedTrack?.trackModel._id.toString() === this.playingTrack?.trackModel._id.toString() &&
          queuedTrack?.uuid === this.playingTrack?.uuid
        ) {
          this.skipForward(1, false)
        }

        break
      case "error":
        const error = message.data
        trackError(error, "MusicPlayer.startStreaming on-dispatcher-error")
        this.subject.next({ messageType: "error", message: error.message })
        console.log("Skipping forward due to error")
        this.skipForward(1, false)
        break
    }
  }
}

export default MusicPlayer

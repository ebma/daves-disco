import { get as httpGet } from "http"
import { get as httpsGet } from "https"
import { PartialObserver, Subject } from "rxjs"
import { Readable } from "stream"
import Youtube from "../libs/Youtube"
import { trackError } from "../utils/trackError"
import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice"

class StreamManager {
  private voiceConnection: VoiceConnection
  private audioResource?: AudioResource
  private player: AudioPlayer
  private streamSource?: Readable | Track
  private volume: number = 0.1
  private subject: Subject<StreamManagerObservableMessage>

  constructor(voiceConnection: VoiceConnection) {
    this.voiceConnection = voiceConnection
    this.subject = new Subject()
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Stop,
        maxMissedFrames: Math.round(5000 / 20),
      },
    })
    this.voiceConnection.subscribe(this.player)
  }

  setVolume(volume: number) {
    if (volume < 0 || volume > 100) {
      throw new Error("Invalid volume! Choose a number between 0-100%")
    }
    this.volume = volume / 100
    if (this.audioResource) {
      this.audioResource.volume?.setVolume(this.volume)
    }
  }

  getVolume() {
    return (this.audioResource?.volume?.volume ?? this.volume) * 100
  }

  get paused(): boolean {
    return Boolean(this.player.state.status === "paused")
  }

  get playing(): boolean {
    return Boolean(this.audioResource)
  }

  pause() {
    if (this.player.state.status === "idle") {
      throw new Error("Can't pause before starting to play something.")
    } else if (this.player.state.status === "paused") {
      throw new Error("Stream paused already.")
    } else {
      this.player.pause(true)
    }
  }

  resume() {
    if (this.player.state.status === "idle") {
      throw new Error("Can't resume before starting to play something.")
    } else if (this.audioResource.audioPlayer.state.status === "playing") {
      throw new Error("Stream running already.")
    } else {
      this.player.unpause()
    }
  }

  async playSound(source: string, volume: number) {
    const vol = volume / 100 // need's to be between 0 and 100
    const trackPaused = this.paused
    const resourceGetter = source.startsWith("https:") ? httpsGet : httpGet
    try {
      resourceGetter(source, (result) => {
        if (this.streamSource instanceof Readable) this.streamSource.unpipe() // unpipe because otherwise the stream will not work with the next voice connection
        const audioResource = createAudioResource(result, { inlineVolume: true, inputType: StreamType.OggOpus })
        audioResource.volume?.setVolume(vol)
        this.player.play(audioResource)
        // this.audioResource = audioResource
        this.player
          .on("stateChange", (oldState, newState) => {
            if (oldState.status === "playing" && newState.status === "idle") {
              if (this.streamSource) {
                this.play(this.streamSource, trackPaused)
              }
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
      let player: AudioPlayer = null
      if (input instanceof Readable) {
        player = await this.playReadable(input)
      } else {
        if (input.source === "radio") {
          // this.musicDispatcher = null // set to null before because of weird behaviour of 'dispatcher.end/finish'
          player = await this.playUnknown(input)
        } else {
          player = await this.playYoutube(input)
        }
      }

      if (trackPaused) player.pause()
      this.player = player
    } catch (error) {
      trackError(error)
    }
  }

  private async playYoutube(input: Track) {
    const source = await Youtube.createReadableStreamFor(input)
    this.streamSource = source

    const audioResource = createAudioResource(source, { inlineVolume: true })
    audioResource.volume?.setVolume(this.volume)
    this.player.play(audioResource)
    this.audioResource = audioResource
    entersState(this.player, AudioPlayerStatus.Playing, 5000000).catch((error) => {
      console.error("entersstate error", error)
    })

    // We save a reference to the player at the time of the play() call,
    const playerAtTheTime = this.player

    this.player
      .on("debug", (info: any) => this.subject.next({ type: "debug", data: info }))
      .on("stateChange", (oldState, newState) => {
        if (oldState.status === "playing" && newState.status === "idle") {
          if (this.player === playerAtTheTime) {
            this.streamSource = null
            this.subject.next({ type: "finish" })
          }
        }
      })
      .on("error", (error: any) => {
        if (this.player === audioResource.audioPlayer) {
          if (source instanceof Readable) source.destroy()
          this.streamSource = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playYoutube error")
      })
    return audioResource.audioPlayer
  }

  private async playUnknown(input: Track) {
    const resourceGetter = input.url.startsWith("https:") ? httpsGet : httpGet
    const stream: Readable = await new Promise((resolve) => {
      resourceGetter(input.url, (result) => {
        resolve(result)
      })
    })

    this.streamSource = stream

    const audioResource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.OggOpus })
    audioResource.volume?.setVolume(this.volume)
    this.player.play(audioResource)
    this.audioResource = audioResource

    // We save a reference to the player at the time of the play() call,
    const playerAtTheTime = this.player

    this.player
      .on("debug", (info: any) => this.subject.next({ type: "debug", data: info }))
      .on("stateChange", (oldState, newState) => {
        if (oldState.status === "playing" && newState.status === "idle") {
          if (this.player === playerAtTheTime) {
            this.streamSource = null
            this.subject.next({ type: "finish" })
          }
        } else if (oldState.status === "playing") {
          this.subject.next({ type: "start" })
        }
      })
      .on("error", (error: any) => {
        if (this.player === playerAtTheTime) {
          this.streamSource = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playUnknown error")
      })
    return audioResource.audioPlayer
  }

  private async playReadable(input: Readable) {
    this.streamSource = input
    const audioResource = createAudioResource(input, { inlineVolume: true, inputType: StreamType.OggOpus })
    audioResource.volume?.setVolume(this.volume)
    this.player.play(audioResource)
    this.audioResource = audioResource

    // We save a reference to the player at the time of the play() call,
    const playerAtTheTime = this.player

    this.player
      .on("debug", (info: any) => this.subject.next({ type: "debug", data: info }))
      .on("stateChange", (oldState, newState) => {
        if (oldState.status === "playing" && newState.status === "idle") {
          if (this.player === playerAtTheTime) {
            this.streamSource = null
            this.subject.next({ type: "finish" })
          }
        } else if (oldState.status === "playing") {
          this.subject.next({ type: "start" })
        }
      })
      .on("error", (error: any) => {
        if (this.player === playerAtTheTime) {
          input.destroy()
          this.streamSource = null
          this.subject.next({ type: "error", data: error && error.message ? error.message : error })
        }
        trackError(error, "StreamManager.playReadable error")
      })

    return audioResource.audioPlayer
  }

  subscribe(subscriber: PartialObserver<StreamManagerObservableMessage>) {
    return this.subject.subscribe(subscriber)
  }

  endCurrent() {
    this.stop()
  }

  stop() {
    if (this.player.state.status !== "idle") {
      this.player.stop()
    }
  }

  disconnect() {
    this.stop()
    this.player = null
    this.voiceConnection.disconnect()
  }
}

export default StreamManager

import ChannelMock from "../test/mocks/Channel"
import MusicPlayer from "./MusicPlayer"
import StreamManager from "./StreamManager"

const testTrack1: Track = {
  title: "Something - Beatles",
  source: "youtube",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY"
}
const testTrack2: Track = {
  title: "Something Else - Beatles",
  source: "youtube",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY"
}

let channelMock: ChannelMock
let musicPlayer: MusicPlayer

beforeEach(async () => {
  channelMock = new ChannelMock()
  const connection = await channelMock.join()
  const streamManager = new StreamManager(connection)
  musicPlayer = new MusicPlayer(streamManager)
})

it("can get volume", () => {
  expect(musicPlayer.volume).toBeDefined()

  musicPlayer.setVolume(50)
  expect(musicPlayer.volume).toBe(50)

  // try invalid values
  const currentVolume = musicPlayer.volume
  musicPlayer.setVolume(101)
  expect(musicPlayer.volume).not.toBe(101)
  expect(musicPlayer.volume).toBe(currentVolume)

  musicPlayer.setVolume(-1)
  expect(musicPlayer.volume).not.toBe(-1)
  expect(musicPlayer.volume).toBe(currentVolume)
})

it("can enqueue 1 track", () => {
  musicPlayer.enqueue(testTrack1)
  // should be empty because the song automatically becomes the current
  expect(musicPlayer.queuedTracks).toEqual([])

  musicPlayer.enqueue(testTrack2)
  expect(musicPlayer.queuedTracks).toEqual([testTrack2])
})

it("can enqueue multiple tracks", () => {
  const subscriberFunction = jest.fn()
  musicPlayer.subscribe({
    next: subscriberFunction
  })

  const tracks = [testTrack1, testTrack2]
  musicPlayer.enqueueAll(tracks)

  expect(musicPlayer.queuedTracks).toEqual([testTrack2])

  setTimeout(() => {
    expect(subscriberFunction).toBeCalledTimes(1)
  }, 500)
})

it("can't be paused when not playing", () => {
  expect(musicPlayer.pauseStream).toThrow()
})

it("can't be resumed when not playing", () => {
  expect(musicPlayer.resumeStream).toThrow()
})

it("starts playing after enqueuing track", done => {
  musicPlayer.enqueue(testTrack1)

  setTimeout(() => {
    expect(musicPlayer.playing).toBeTruthy()
    done()
  }, 1000)
})

it("returns correct playing state", done => {
  expect(musicPlayer.playing).toBeFalsy()

  musicPlayer.subscribe({
    next: message => {
      if (message.messageType === "status" && message.message === "playing") {
        expect(musicPlayer.playing).toBeTruthy()
        done()
      }
    }
  })

  musicPlayer.enqueue(testTrack1)
})

it("returns correct current track", done => {
  expect(musicPlayer.currentTrack).toBeUndefined()

  musicPlayer.enqueue(testTrack1)
  setTimeout(() => {
    expect(musicPlayer.currentTrack).toBe(testTrack1)

    musicPlayer.enqueue(testTrack2)
    musicPlayer.skipForward()
    setTimeout(() => {
      expect(musicPlayer.currentTrack).toBe(testTrack2)
      done()
    }, 500)
  }, 500)
})

it("can be subscribed", done => {
  const subscriberFunction = jest.fn()
  musicPlayer.subscribe({
    next: subscriberFunction
  })

  musicPlayer.enqueue(testTrack1)
  musicPlayer.enqueue(testTrack2)

  setTimeout(() => {
    expect(subscriberFunction).toBeCalledWith({ messageType: "status", message: "currentTrack", data: testTrack1 })
    expect(subscriberFunction).toBeCalledWith({ messageType: "status", message: "currentQueue", data: [] })

    expect(subscriberFunction).toBeCalledWith({ messageType: "status", message: "currentTrack", data: testTrack1 })
    expect(subscriberFunction).toBeCalledWith({ messageType: "status", message: "currentQueue", data: [testTrack2] })

    expect(subscriberFunction).toBeCalledWith({ messageType: "status", message: "playing" })
    done()
  }, 500)
})

it("can be cleared", () => {
  musicPlayer.enqueue(testTrack1)
  musicPlayer.enqueue(testTrack2)
  musicPlayer.clear()
  expect(musicPlayer.queuedTracks).toEqual([])
})

it("can skip forward", done => {
  expect(() => musicPlayer.skipForward()).toThrow()
  expect(musicPlayer.playing).toBeFalsy()

  musicPlayer.enqueue(testTrack1)
  musicPlayer.enqueue(testTrack2)

  setTimeout(() => {
    expect(musicPlayer.playing).toBeTruthy()
    expect(musicPlayer.currentTrack).toBe(testTrack1)
    musicPlayer.skipForward()
    setTimeout(() => {
      expect(musicPlayer.currentTrack).toBe(testTrack2)
      expect(musicPlayer.playing).toBeTruthy()
      done()
    }, 500)
  }, 100)
})

it("can skip backwards", done => {
  expect(() => musicPlayer.skipPrevious()).toThrow()
  expect(musicPlayer.playing).toBeFalsy()

  musicPlayer.enqueue(testTrack1)
  musicPlayer.enqueue(testTrack2)

  setTimeout(() => {
    expect(musicPlayer.playing).toBeTruthy()
    expect(musicPlayer.currentTrack).toBe(testTrack1)
    musicPlayer.skipPrevious()
    setTimeout(() => {
      // still testtrack because skipping to the previous will cause it to play again
      expect(musicPlayer.currentTrack).toBe(testTrack1)
      expect(musicPlayer.playing).toBeTruthy()

      musicPlayer.skipForward(2)
      musicPlayer.skipPrevious()
      setTimeout(() => {
        expect(musicPlayer.currentTrack).toBe(testTrack2)
        done()
      }, 100)
    }, 100)
  }, 100)
})

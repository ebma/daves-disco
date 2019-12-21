import StreamManager, { Dispatcher } from "./StreamManager"

const testTrack: Track = {
  title: "Something - Beatles",
  source: "youtube",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY"
}

class DispatcherMock implements Dispatcher {
  destroyed: boolean = false
  passes: number = 3
  paused: boolean = false
  volume: number = 0.1

  end = jest.fn()

  pause = jest.fn(() => {
    this.paused = true
  })
  resume = jest.fn(() => {
    this.paused = false
  })
  setVolume = jest.fn((volume: number) => {
    this.volume = volume
  })

  on(event: any, listener: any) {
    return this
  }
  once(event: any, listener: any) {
    return this
  }
}

let streamManager: StreamManager
let dispatcherMock: DispatcherMock

beforeEach(() => {
  dispatcherMock = new DispatcherMock()
  const createStream = jest.fn(() => dispatcherMock)
  streamManager = new StreamManager(createStream)
})

it("can change volume", async () => {
  expect(streamManager.getVolume()).toBeDefined()

  streamManager.setVolume(50)
  expect(streamManager.getVolume()).toBe(50)

  expect(() => streamManager.setVolume(101)).toThrow()

  expect(() => streamManager.setVolume(-1)).toThrow()

  // test volume change when playing
  await streamManager.playTrack(testTrack)
  streamManager.setVolume(20)
  expect(dispatcherMock.setVolume).toBeCalledWith(0.2)
})

it("can be paused", async () => {
  // will throw because no track playing
  expect(() => streamManager.pause()).toThrow()

  await streamManager.playTrack(testTrack)
  expect(() => streamManager.pause()).not.toThrow()
  expect(streamManager.paused).toBeTruthy()
  expect(dispatcherMock.pause).toBeCalled()

  // will throw because already paused
  expect(() => streamManager.pause()).toThrow()
})

it("can be resumed", async () => {
  // will throw because no track playing
  expect(() => streamManager.resume()).toThrow()

  await streamManager.playTrack(testTrack)
  expect(() => streamManager.resume()).toThrow()
  streamManager.pause()
  expect(() => streamManager.resume()).not.toThrow()
  expect(streamManager.paused).toBeFalsy()
  expect(dispatcherMock.resume).toBeCalled()

  // will throw because already resumed
  expect(() => streamManager.resume()).toThrow()
})

it("can stop playing", async () => {
  streamManager.stopPlaying()
  // expect end was not called because nothing was playing
  expect(dispatcherMock.end).not.toBeCalledWith()

  await streamManager.playTrack(testTrack)
  streamManager.stopPlaying()
  expect(dispatcherMock.end).toBeCalledWith("forceStop")
})

it("can disconnect", async () => {
  expect(() => streamManager.disconnect()).not.toThrow()

  await streamManager.playTrack(testTrack)
  expect(() => streamManager.disconnect()).not.toThrow()
})

it("catches an error when playing invalid track", () => {
  const invalidTrack: Track = { url: "test", title: "test", source: "youtube" }

  expect(streamManager.playTrack(invalidTrack)).rejects.toThrow()
})

it("returns correct playing state", async () => {
  expect(streamManager.playing).toBeFalsy()

  await streamManager.playTrack(testTrack)
  expect(streamManager.playing).toBeTruthy()
})

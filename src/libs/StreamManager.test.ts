import DispatcherMock from "../test/mocks/Dispatcher"
import StreamHolderMock from "../test/mocks/StreamHolder"
import StreamManager from "./StreamManager"

const testTrack: Track = {
  title: "Something - Beatles",
  source: "youtube",
  url: "https://www.youtube.com/watch?v=UelDrZ1aFeY"
}

let streamManager: StreamManager
let streamHolderMock: StreamHolderMock
let dispatcherMock: DispatcherMock

beforeEach(() => {
  streamHolderMock = new StreamHolderMock()
  streamManager = new StreamManager(streamHolderMock)
  dispatcherMock = streamHolderMock.dispatcher as any
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
  expect.assertions(1)
  const invalidTrack: Track = { url: "test", title: "test", source: "youtube" }
  return expect(streamManager.playTrack(invalidTrack)).rejects.toBeDefined()
})

it("returns correct playing state", async () => {
  expect(streamManager.playing).toBeFalsy()

  await streamManager.playTrack(testTrack)
  expect(streamManager.playing).toBeTruthy()
})

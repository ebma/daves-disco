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

beforeEach(() => {
  streamHolderMock = new StreamHolderMock()
  streamManager = new StreamManager(streamHolderMock)
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
  expect(streamHolderMock.dispatcher.setVolume).toBeCalledWith(0.2)
})

it("can be paused", async () => {
  // will throw because no track playing
  expect(() => streamManager.pause()).toThrow()

  await streamManager.playTrack(testTrack)
  expect(() => streamManager.pause()).not.toThrow()
  expect(streamManager.paused).toBeTruthy()
  expect(streamHolderMock.dispatcher.pause).toBeCalled()

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
  expect(streamHolderMock.dispatcher.resume).toBeCalled()

  // will throw because already resumed
  expect(() => streamManager.resume()).toThrow()
})

it("can skip", async () => {
  expect(() => streamManager.skip()).toThrow()

  await streamManager.playTrack(testTrack)
  streamManager.skip()
  expect(streamHolderMock.dispatcher.end).toBeCalledWith("skip")
})

it("can stop playing", async () => {
  expect(() => streamManager.stop()).toThrow()

  await streamManager.playTrack(testTrack)
  streamManager.stop()
  expect(streamHolderMock.dispatcher.end).toBeCalledWith("forceStop")
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

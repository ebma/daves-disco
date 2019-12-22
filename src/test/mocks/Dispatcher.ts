import { Dispatcher } from "../../libs/StreamManager"

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
    if (event === "start") {
      setTimeout(() => {
        listener()
      }, 100)
    } else if (event === "end") {
      setTimeout(() => {
        listener()
      }, 2000)
    }
    return this
  }
}

export default DispatcherMock

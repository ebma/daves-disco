import { Channel } from "../../libs/MusicPlayer"
import DispatcherMock from "./Dispatcher"

class ChannelMock implements Channel {
  full: boolean = false
  join = jest.fn(async () => {
    const voiceConnectionMock = { playStream: () => new DispatcherMock() }
    return voiceConnectionMock
  })
}

export default ChannelMock

import StreamHolderMock from "./StreamHolder"

class ChannelMock implements Channel {
  leave(): void {
    // do nothing
  }
  full: boolean = false
  join = jest.fn(async () => {
    return new StreamHolderMock()
  })
}

export default ChannelMock

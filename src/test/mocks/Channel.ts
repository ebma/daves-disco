import StreamHolderMock from "./StreamHolder"

class ChannelMock implements Channel {
  leave(): void {
    throw new Error("Method not implemented.")
  }
  full: boolean = false
  join = jest.fn(async () => {
    return new StreamHolderMock()
  })
}

export default ChannelMock

import DispatcherMock from "./Dispatcher"

class StreamHolderMock implements StreamHolder {
  dispatcher: Dispatcher
  connect(): void {
    // do nothing
  }
  disconnect(): void {
    this.dispatcher = null
  }
  playStream(stream: any, options?: StreamOptions): Dispatcher {
    this.dispatcher = new DispatcherMock()
    return this.dispatcher
  }
  on(event: string, listener: Function): this {
    return this
  }
  once(event: string, listener: Function): this {
    return this
  }
}

export default StreamHolderMock

class StreamHolderMock implements StreamHolder {
  dispatcher: Dispatcher
  connect(): void {
    throw new Error("Method not implemented.")
  }
  disconnect(): void {
    throw new Error("Method not implemented.")
  }
  playStream(stream: any, options?: StreamOptions): Dispatcher {
    throw new Error("Method not implemented.")
  }
  on(event: string, listener: Function): this {
    throw new Error("Method not implemented.")
  }
  once(event: string, listener: Function): this {
    throw new Error("Method not implemented.")
  }
}

export default StreamHolderMock

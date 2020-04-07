const info = (...params: any) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(...params)
  }
}

const error = (...params: any) => {
  console.error(...params)
}

const logger = {
  info,
  error
}

export default logger

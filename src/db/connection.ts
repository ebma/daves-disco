import mongoose from "mongoose"

export function connect(databasePath: string) {
  mongoose.connect(databasePath, {
    autoIndex: true,
  })

  const db = mongoose.connection
  db.on("error", console.error.bind(console, "connection error:"))
  db.once("open", function() {
    console.log("mongoose connection opened")
  })
}

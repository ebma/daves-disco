import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

const SECRET = process.env.JWT_SECRET

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

const BOT_TOKEN = process.env.BOT_TOKEN
const OWNER_ID = process.env.OWNER_ID

const DEPLOYED_URL = process.env.DEPLOYED_URL

const CERT_PATH = process.env.CERT_PATH
const KEY_PATH = process.env.KEY_PATH

if (process.env.NODE_ENV === "test") {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

export default {
  BOT_TOKEN,
  CERT_PATH,
  KEY_PATH,
  DEPLOYED_URL,
  MONGODB_URI,
  OWNER_ID,
  PORT,
  SECRET,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  YOUTUBE_API_KEY
}

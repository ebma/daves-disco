import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config()
}

// eslint-disable-next-line no-unused-vars
const client = require("./bot/bot").init();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// eslint-disable-next-line no-unused-vars
const client = require("./bot/bot").init();

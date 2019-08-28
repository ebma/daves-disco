if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { prefix } = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", message => {
  if (message.content === `${prefix}ping`) {
    message.reply("pong");
  } else if (message.content === `${prefix}server`) {
    message.channel.send(
      `Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`
    );
  }
});

client.login(process.env.BOT_TOKEN);

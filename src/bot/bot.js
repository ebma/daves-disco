const Discord = require("discord.js");
const messageHandler = require("./message-handler");
const client = new Discord.Client();

function prepareDiscordClient() {
  client.commands = new Discord.Collection();

  client.music = require("discord.js-musicbot-addon");
  client.music.start(client, {
    youtubeKey: process.env.YOUTUBE_API_KEY
  });
}

function prepareCommands() {
  const fs = require("fs");

  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  }
}

function onClientReady() {
  // remove help command from musicBot
  try {
    delete client.music.bot.commands.delete("help");
  } catch (error) {
    console.log(error);
  }

  for (const command of client.music.bot.commands) {
    client.commands.set(command[0], command[1]);
  }

  console.log("I'm ready!");
}

function init() {
  prepareDiscordClient();
  prepareCommands();

  client.once("ready", onClientReady);

  client.on("message", messageHandler.handleMessage);

  client.login(process.env.BOT_TOKEN);

  return client;
}

module.exports = {
  init
};

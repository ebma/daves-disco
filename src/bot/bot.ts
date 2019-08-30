import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";

import messageHandler from "./message-handler";

export interface ExtendedClient extends Client {
  commands: Collection<string, Command>;
  music: any;
}

const extendedClient = buildExtendedClient()

function buildExtendedClient(): ExtendedClient {
  const client = new Client() as any;
  client.commands = new Collection();

  client.music = require("discord.js-musicbot-addon");
  client.music.start(client, {
    youtubeKey: process.env.YOUTUBE_API_KEY,
  });

  return client;
}

function prepareCommands() {
  const commandFiles = readdirSync("./src/commands").filter((file) =>
    file.endsWith(".js"),
  );

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`) as Command;
    extendedClient.commands.set(command.name, command);
  }
}

const onClientReady = () => {
  // remove help command from musicBot
  try {
    extendedClient.music.bot.commands.delete("help");
  } catch (error) {
    console.log(error);
  }

  console.log("I'm ready!");
}

export function init(): ExtendedClient {
  prepareCommands();

  extendedClient.once("ready", onClientReady);

  extendedClient.on("message", messageHandler.handleMessage);

  extendedClient.login(process.env.BOT_TOKEN);

  return extendedClient;
}
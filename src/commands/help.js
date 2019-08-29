const { prefix } = require("../config.json");

function fillToSpacing(string, spacing) {
  let additional = "";
  let i = 0;
  for (i = 0; string.length + additional.length < spacing; i++) {
    additional += " ";
  }
  return string + additional;
}

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands"],
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;

    for (const command of message.client.music.bot.commands) {
      message.client.commands.set(command[0], command[1]);
    }

    if (!args.length) {
      data.push("Here's a list of all my commands:");

      const commandStrings = commands.map(
        command =>
          `**${fillToSpacing(`${command.name}:`, 20)}** ${command.description ||
            command.help}`
      );
      commandStrings.sort(function(a, b) {
        return a.localeCompare(b);
      });
      data.push(commandStrings.join("\n"));
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've sent you a DM with all my commands!");
        })
        .catch(error => {
          console.error(
            `Could not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply("it seems like I can't DM you!");
        });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description || command.help)
      data.push(`**Description:** ${command.description || command.help}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
  }
};

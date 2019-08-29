module.exports = {
  name: "v-down",
  description: "Decreases the volume by 5 units.",
  aliases: ["mamaleisa"],
  usage: "[command]",
  cooldown: 5,
  execute(message) {
    const musicBot = message.client.music.bot;
    const volumeCommand = musicBot.volumeFunction;

    if (musicBot.queues.size > 0) {
      const currentVolume = musicBot.queues.get(message.guild.id).volume;
      const newVolume = currentVolume - 5;

      volumeCommand(message, newVolume);
    } else {
      message.channel.send(
        `You have to start playing a song before configuring the volume.`
      );
    }
  }
};

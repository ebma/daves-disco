const timeForVote = 15000;

function execute(message) {
  const filter = (reaction, user) => {
    if (user.id === message.client.user.id) return false;
    else if (reaction.emoji.name === "👍") {
      message.channel.send(`${user.username} ist ein 31er.`);
      return true;
    } else return false;
  };

  const mentionedUsers = message.mentions.members;
  if (mentionedUsers.size === 0) {
    message.channel.send(
      `You have to specify the user you want to kick with @User.`
    );
    return;
  }

  const userToKick = mentionedUsers.first();
  if (!userToKick.voiceChannel) {
    message.channel.send(
      `${userToKick.displayName} is not even in a voice channel. :rolling_eyes:`
    );
    return;
  }

  const requiredVotesAmount = userToKick.voiceChannel.members.size - 1;
  message.channel.send(`You have ${timeForVote / 1000} seconds to vote.`);
  message.react("👍");

  const collector = message.createReactionCollector(filter, {
    time: timeForVote
  });

  collector.on("collect", reaction => {
    if (reaction.count >= requiredVotesAmount) {
      message.channel.send(`Time to say goodbye ${userToKick}.`);
      userToKick.setVoiceChannel(null);
    }
  });

  collector.on("end", collected => {
    if (collected.size < requiredVotesAmount) {
      message.channel.send(
        `Not enough votes collected. ${userToKick} can stay! :tada:`
      );
    }
  });
}

module.exports = {
  name: "votekick",
  description: "Starts a vote to kick a user from the voice channel.",
  aliases: ["verschwinde"],
  usage: "[command @user]",
  cooldown: 5,
  execute
};

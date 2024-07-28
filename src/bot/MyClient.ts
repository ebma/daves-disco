import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo"
import config from "../utils/config"
import { GatewayIntentBits } from "discord.js"

export class MyClient extends AkairoClient {
  commandHandler: CommandHandler
  inhibitorHandler: InhibitorHandler
  listenerHandler: ListenerHandler


  constructor() {
    const intents = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.MessageContent
    ]
    super(
      {
        ownerID: config.OWNER_ID,
      },
      {
        intents,
      }
    )

    this.commandHandler = new CommandHandler(this, {
      allowMention: true,
      defaultCooldown: 5_000,
      directory: __dirname + "/commands/",
      handleEdits: true,
      commandUtil: true,
      prefix: "!",
    })
    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: __dirname + "/inhibitors/",
    })
    this.listenerHandler = new ListenerHandler(this, {
      directory: __dirname + "/listeners/",
    })

    this.commandHandler.loadAll()
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
    this.inhibitorHandler.loadAll()
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.loadAll()
  }
}

import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from "discord-akairo"

export class MyClient extends AkairoClient {
  commandHandler: CommandHandler
  inhibitorHandler: InhibitorHandler
  listenerHandler: ListenerHandler

  constructor() {
    super(
      {
        ownerID: process.env.OWNER_ID
      },
      {}
    )

    this.commandHandler = new CommandHandler(this, {
      allowMention: true,
      defaultCooldown: 5_000,
      directory: __dirname + "/commands/",
      handleEdits: true,
      commandUtil: true,
      prefix: "!"
    })
    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: __dirname + "/inhibitors/"
    })
    this.listenerHandler = new ListenerHandler(this, {
      directory: __dirname + "/listeners/"
    })

    this.commandHandler.loadAll()
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
    this.inhibitorHandler.loadAll()
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.listenerHandler.loadAll()
  }
}

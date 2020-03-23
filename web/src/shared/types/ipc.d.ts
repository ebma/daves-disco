declare namespace IPC {
  const Messages: {
    // Commands (must match akairo command alias)
    Clear: "Clear"
    Play: "Play"
    Pause: "Pause"
    Resume: "Resume"
    Skip: "Skip"
    Stop: "Stop"
    SkipPrevious: "SkipPrevious"
    Volume: "Volume"

    // Requests
    GetGuilds: "GetGuilds"
    GetMembers: "GetMembers"
    GetTrack: "GetTrack"
    GetQueue: "GetQueue"
    GetVolume: "GetVolume"
    GetPausedState: "GetPausedState"
    UpdateQueue: "UpdateQueue"

    // Subscribable Info Messages
    CurrentTrack: "CurrentTrack"
    CurrentQueue: "CurrentQueue"
    Error: "Error"
    PauseChange: "PauseChange"
    VolumeChange: "VolumeChange"
  }

  export type MessageType = typeof Messages

  export interface MessageSignatures {
    [Messages.Clear]: (guildID: GuildID) => void
    [Messages.Play]: (guildID: GuildID, query: string) => void
    [Messages.Pause]: (guildID: GuildID) => void
    [Messages.Resume]: (guildID: GuildID) => void
    [Messages.Skip]: (guildID: GuildID, amount: number) => void
    [Messages.Stop]: (guildID: GuildID) => void
    [Messages.SkipPrevious]: (guildID: GuildID, amount: number) => void
    [Messages.Volume]: (guildID: GuildID, newVolume: number) => void

    [Messages.GetGuilds]: () => ReducedGuilds
    [Messages.GetMembers]: (guildID: GuildID) => ReducedMembers
    [Messages.GetTrack]: (guildID: GuildID) => Track
    [Messages.GetQueue]: (guildID: GuildID) => Track[]
    [Messages.GetVolume]: (guildID: GuildID) => number
    [Messages.GetPausedState]: (guildID: GuildID) => boolean
    [Messages.UpdateQueue]: (guildID: GuildID, newItems: Track[]) => void

    [Messages.CurrentTrack]: (track: Track) => Track
    [Messages.CurrentQueue]: (queue: Track[]) => Track[]
    [Messages.Error]: (error: string) => any
    [Messages.PauseChange]: (paused: boolean) => boolean
    [Messages.VolumeChange]: (volume: number) => number
  }

  export type MessageArgs<Message extends keyof MessageType> = MessageSignatures[Message] extends () => any
    ? []
    : MessageSignatures[Message] extends (arg0: infer Arg0) => any
    ? [Arg0]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1) => any
    ? [Arg0, Arg1]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1, arg2: infer Arg2) => any
    ? [Arg0, Arg1, Arg2]
    : MessageSignatures[Message] extends (arg0: infer Arg0, arg1: infer Arg1, arg2: infer Arg2, arg3: infer Arg3) => any
    ? [Arg0, Arg1, Arg2, Arg3]
    : never

  export type MessageReturnType<Message extends keyof MessageType> = ReturnType<MessageSignatures[Message]>

  export interface SocketMessage {
    args: any
    messageType: keyof IPC.MessageType
    messageID: number
  }

  export interface CallResultMessage<Message extends keyof MessageType> {
    messageType: Message
    messageID: number
    result: IPC.MessageReturnType<Message>
  }

  export interface CallErrorMessage<Message extends keyof MessageType> {
    messageType: Message
    messageID: number
    error: any
  }

  export type CallResponseMessage<Message extends keyof MessageType> =
    | CallResultMessage<Message>
    | CallErrorMessage<Message>
}

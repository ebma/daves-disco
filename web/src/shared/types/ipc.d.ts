declare namespace IPC {
  const Messages: {
    // Requests
    Clear: "Clear"
    Play: "Play"
    Pause: "Pause"
    Resume: "Resume"
    Skip: "Skip"
    Stop: "Stop"
    SkipPrevious: "SkipPrevious"
    Shuffle: "Shuffle"
    Volume: "Volume"

    GetGuilds: "GetGuilds"
    GetMembers: "GetMembers"
    GetPlayerAvailable: "GetPlayerAvailable"
    GetTrack: "GetTrack"
    GetQueue: "GetQueue"
    GetVolume: "GetVolume"
    GetPausedState: "GetPausedState"
    UpdateQueue: "UpdateQueue"

    PlayTrack: "PlayTrack"
    PlayPlaylist: "PlayPlaylist"

    GetTracksFromTerm: "GetTracksFromTerm"

    // Subscribable Info Messages
    CurrentTrack: "CurrentTrack"
    CurrentQueue: "CurrentQueue"
    Error: "Error"
    PauseChange: "PauseChange"
    VolumeChange: "VolumeChange"
    RecentHistoryChange: "RecentHistoryChange"
    FavouritesChange: "FavouritesChange"
  }

  export type MessageType = typeof Messages

  export interface MessageSignatures {
    [Messages.Clear]: (guildID: GuildID) => void
    [Messages.Play]: (guildID: GuildID, userID: UserID, query: string) => void
    [Messages.Pause]: (guildID: GuildID) => void
    [Messages.Resume]: (guildID: GuildID) => void
    [Messages.Skip]: (guildID: GuildID, amount: number) => void
    [Messages.Stop]: (guildID: GuildID) => void
    [Messages.SkipPrevious]: (guildID: GuildID, amount: number) => void
    [Messages.Shuffle]: (guildID: GuildID) => void
    [Messages.Volume]: (guildID: GuildID, newVolume: number) => void

    [Messages.GetGuilds]: () => ReducedGuilds
    [Messages.GetMembers]: (guildID: GuildID) => ReducedMembers
    [Messages.GetPlayerAvailable]: (guildID: GuildID) => boolean
    [Messages.GetTrack]: (guildID: GuildID) => Track
    [Messages.GetQueue]: (guildID: GuildID) => Track[]
    [Messages.GetVolume]: (guildID: GuildID) => number
    [Messages.GetPausedState]: (guildID: GuildID) => boolean
    [Messages.UpdateQueue]: (guildID: GuildID, newItems: Track[]) => void

    [Messages.PlayTrack]: (guildID: GuildID, userID: UserID, track: Track) => void
    [Messages.PlayPlaylist]: (guildID: GuildID, userID: UserID, playlist: Playlist) => void

    [Messages.GetTracksFromTerm]: (term: string) => Track[]

    [Messages.CurrentTrack]: () => Track
    [Messages.CurrentQueue]: () => Track[]
    [Messages.Error]: () => any
    [Messages.PauseChange]: () => boolean
    [Messages.VolumeChange]: () => number

    [Messages.RecentHistoryChange]: () => void
    [Messages.FavouritesChange]: () => void
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
    token: string
    messageType: keyof IPC.MessageType
    messageID: number
  }

  export interface ServerMessage<Message extends keyof MessageType> {
    data: MessageReturnType<Message>
    messageType: Message
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

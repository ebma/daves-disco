declare namespace IPC {
  const Messages: {
    // Requests
    Clear: "Clear"
    Play: "Play"
    Pause: "Pause"
    Resume: "Resume"
    Loop: "Loop"
    Skip: "Skip"
    Stop: "Stop"
    SkipPrevious: "SkipPrevious"
    Shuffle: "Shuffle"
    Volume: "Volume"

    PlayTrack: "PlayTrack"
    PlayRadio: "PlayRadio"
    PlayPlaylist: "PlayPlaylist"
    PlaySound: "PlaySound"

    // Subscribable Info Messages
    Error: "Error"
    TracksChange: "TracksChange"
    PlaylistsChange: "PlaylistsChange"
    PlayerChange: "PlayerChange"
    SoundboardItemsChange: "SoundboardItemsChange"
  }

  export type MessageType = typeof Messages

  export interface MessageSignatures {
    [Messages.Clear]: () => void
    [Messages.Play]: (query: string) => void
    [Messages.Pause]: () => void
    [Messages.Resume]: () => void
    [Messages.Loop]: (loopState: LoopState) => void
    [Messages.Skip]: (amount: number) => void
    [Messages.Stop]: () => void
    [Messages.SkipPrevious]: (amount: number) => void
    [Messages.Shuffle]: () => void
    [Messages.Volume]: (newVolume: number) => void

    [Messages.PlayTrack]: (track: Track) => void
    [Messages.PlayRadio]: (radio: Radio) => void
    [Messages.PlayPlaylist]: (playlist: Playlist) => void
    [Messages.PlaySound]: (source: string, volume: number) => void

    [Messages.CurrentTrack]: () => Track
    [Messages.CurrentQueue]: () => Track[]
    [Messages.Error]: () => any
    [Messages.PauseChange]: () => boolean
    [Messages.VolumeChange]: () => number

    [Messages.TracksChange]: () => void
    [Messages.PlaylistsChange]: () => void
    [Messages.PlayerChange]: () => void
    [Messages.SoundboardItemsChange]: () => void
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
    guildID: GuildID
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

export const Messages: IPC.MessageType = {
  Clear: "Clear",
  Play: "Play",
  Pause: "Pause",
  Resume: "Resume",
  Skip: "Skip",
  Stop: "Stop",
  SkipPrevious: "SkipPrevious",
  Volume: "Volume",

  GetGuilds: "GetGuilds",
  GetMembers: "GetMembers",
  GetPlayerAvailable: "GetPlayerAvailable",
  GetTrack: "GetTrack",
  GetQueue: "GetQueue",
  GetVolume: "GetVolume",
  GetPausedState: "GetPausedState",
  UpdateQueue: "UpdateQueue",

  CurrentTrack: "CurrentTrack",
  CurrentQueue: "CurrentQueue",
  Error: "Error",
  PauseChange: "PauseChange",
  VolumeChange: "VolumeChange"
} as const

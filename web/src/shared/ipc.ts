export const Messages: IPC.MessageType = {
  Clear: "Clear",
  Play: "Play",
  Pause: "Pause",
  Resume: "Resume",
  Loop: "Loop",
  Skip: "Skip",
  Stop: "Stop",
  SkipPrevious: "SkipPrevious",
  Shuffle: "Shuffle",
  Volume: "Volume",

  PlayTrack: "PlayTrack",
  PlayPlaylist: "PlayPlaylist",
  PlaySound: "PlaySound",

  Error: "Error",

  TracksChange: "TracksChange",
  PlaylistsChange: "PlaylistsChange",
  SoundboardItemsChange: "SoundboardItemsChange",
  PlayerChange: "PlayerChange"
} as const

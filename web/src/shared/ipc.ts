export const Messages: IPC.MessageType = {
  Clear: "Clear",
  Play: "Play",
  Pause: "Pause",
  Resume: "Resume",
  Skip: "Skip",
  Stop: "Stop",
  SkipPrevious: "SkipPrevious",
  Shuffle: "Shuffle",
  Volume: "Volume",

  PlayTrack: "PlayTrack",
  PlayPlaylist: "PlayPlaylist",

  Error: "Error",

  TracksChange: "TracksChange",
  PlaylistsChange: "PlaylistsChange",
  PlayerChange: "PlayerChange"
} as const

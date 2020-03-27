import React from "react"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import ClearIcon from "@material-ui/icons/Clear"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import { useDebounce } from "../../hooks/util"
import { GuildContext } from "../../context/guild"
import { SocketContext } from "../../context/socket"
import StyledButton from "../StyledButton"
import CurrentSongCard from "./CurrentSongCard"
import VolumeSlider from "./VolumeSlider"
import { trackError } from "../../context/notifications"
import { Messages } from "../../shared/ipc"

interface DebouncedButtonProps {
  alignIconBefore?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon: JSX.Element
  style?: React.CSSProperties
  text: string
  onClick?: () => void
}

function DebouncedButton(props: DebouncedButtonProps) {
  const onButtonClick = useDebounce(() => props.onClick && props.onClick(), 300, {
    leading: true,
    trailing: false
  })

  return <StyledButton {...props} text={undefined} onClick={onButtonClick} />
}

interface ControlItemProps {
  disabled?: boolean
  onClick?: () => void
}

function PlayButton(props: ControlItemProps) {
  return <DebouncedButton {...props} icon={<PlayIcon />} text="Play" />
}

function PauseButton(props: ControlItemProps) {
  return <DebouncedButton {...props} icon={<PauseIcon />} text="Pause" />
}

function SkipPreviousButton(props: ControlItemProps) {
  return <DebouncedButton {...props} alignIconBefore icon={<SkipPreviousIcon />} text="Skip previous" />
}

function SkipNextButton(props: ControlItemProps) {
  return <DebouncedButton {...props} icon={<SkipNextIcon />} text="Skip next" />
}

function StopPlayerButton(props: ControlItemProps) {
  return (
    <DebouncedButton
      {...props}
      alignIconBefore
      fullWidth
      icon={<ClearIcon />}
      style={{ padding: 16, margin: 0, marginTop: 16 }}
      text="Stop Player"
    />
  )
}

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
  disabled?: boolean
  guildID: GuildID
}

function PlayerArea(props: Props) {
  const { currentTrack, disabled, guildID } = props

  const { isPlayerAvailable } = React.useContext(GuildContext)
  const { connectionState, sendMessage, subscribeToMessages } = React.useContext(SocketContext)

  const [isPaused, setPaused] = React.useState(false)
  const [volume, setVolume] = React.useState(50)

  React.useEffect(() => {
    const unsubcribePause = subscribeToMessages(Messages.PauseChange, isPaused => setPaused(isPaused))
    const unsubscribeVolume = subscribeToMessages(Messages.VolumeChange, setVolume)

    if (connectionState === "connected" && guildID && isPlayerAvailable(guildID)) {
      sendMessage(Messages.GetVolume, guildID)
        .then(setVolume)
        .catch(trackError)
      sendMessage(Messages.GetPausedState, guildID)
        .then(setPaused)
        .catch(trackError)
    }

    return () => {
      unsubcribePause()
      unsubscribeVolume()
    }
  }, [connectionState, guildID, isPlayerAvailable, sendMessage, subscribeToMessages])

  return (
    <Paper style={{ padding: 16 }}>
      <Grid container direction="row" alignItems="center" spacing={5}>
        <Grid item sm={6} xs={12}>
          <CurrentSongCard currentTrack={currentTrack} style={{ alignSelf: "flex-start" }} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Grid container direction="row" justify="center">
            <Grid item>
              <SkipPreviousButton
                disabled={disabled}
                onClick={() => sendMessage(Messages.SkipPrevious, guildID, 1).catch(trackError)}
              />
            </Grid>
            <Grid item>
              {isPaused ? (
                <PlayButton
                  disabled={disabled}
                  onClick={() => sendMessage(Messages.Resume, guildID).catch(trackError)}
                />
              ) : (
                <PauseButton
                  disabled={disabled}
                  onClick={() => sendMessage(Messages.Pause, guildID).catch(trackError)}
                />
              )}
            </Grid>
            <Grid item>
              {
                <SkipNextButton
                  disabled={disabled}
                  onClick={() => sendMessage(Messages.Skip, guildID, 1).catch(trackError)}
                />
              }
            </Grid>
          </Grid>
          <VolumeSlider
            disabled={disabled}
            volume={volume}
            onChange={(newVolume: number) => {
              sendMessage(Messages.Volume, guildID, newVolume)
            }}
          />
          <StopPlayerButton disabled={disabled} onClick={() => sendMessage(Messages.Stop, guildID).catch(trackError)} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default React.memo(PlayerArea)

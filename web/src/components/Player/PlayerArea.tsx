import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import ClearIcon from "@material-ui/icons/Clear"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import { useDebounce } from "../../hooks/util"
import StyledButton from "../StyledButton"
import CurrentSongCard from "./CurrentSongCard"
import VolumeSlider from "./VolumeSlider"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import {
  skipTracks,
  skipPreviousTracks,
  pausePlayer,
  resumePlayer,
  setPlayerVolume,
  stopPlayer
} from "../../redux/playerSlice"

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
  style?: React.CSSProperties
}

function PlayerArea(props: Props) {
  const { style } = props

  const dispatch: AppDispatch = useDispatch()
  const { available, paused, queue: queueIDs, volume } = useSelector((state: RootState) => state.player)

  const disabled = !available || queueIDs.length === 0

  return (
    <Paper style={{ ...style, padding: 16 }}>
      <Grid container direction="row" alignItems="center" spacing={5}>
        <Grid item sm={6} xs={12}>
          <CurrentSongCard style={{ alignSelf: "flex-start" }} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <Grid container direction="row" justify="center">
            <Grid item>
              <SkipPreviousButton disabled={disabled} onClick={() => dispatch(skipPreviousTracks(1))} />
            </Grid>
            <Grid item>
              {paused ? (
                <PlayButton disabled={disabled} onClick={() => dispatch(resumePlayer())} />
              ) : (
                <PauseButton disabled={disabled} onClick={() => dispatch(pausePlayer())} />
              )}
            </Grid>
            <Grid item>{<SkipNextButton disabled={disabled} onClick={() => dispatch(skipTracks(1))} />}</Grid>
          </Grid>
          <VolumeSlider
            disabled={disabled}
            volume={volume}
            onChange={(newVolume: number) => {
              dispatch(setPlayerVolume(newVolume))
            }}
          />
          <StopPlayerButton disabled={disabled} onClick={() => dispatch(stopPlayer())} />
        </Grid>
      </Grid>
    </Paper>
  )
}

export default React.memo(PlayerArea)

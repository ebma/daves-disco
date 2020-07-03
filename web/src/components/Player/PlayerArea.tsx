import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import ClearIcon from "@material-ui/icons/Clear"
import PauseIcon from "@material-ui/icons/Pause"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { useDebounce } from "../../hooks/util"
import {
  pausePlayer,
  resumePlayer,
  setPlayerVolume,
  skipPreviousTracks,
  skipTracks,
  stopPlayer
} from "../../redux/playerSlice"
import { SpotifyHelper } from "../../shared/utils/helpers"
import StyledButton from "../StyledButton"
import VolumeSlider from "./VolumeSlider"

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
  const { available, currentTrack, paused, queue: queueIDs, volume } = useSelector((state: RootState) => state.player)

  console.log(
    "currentTrack.thumbnail?.large || currentTrack.thumbnail?.medium || currentTrack.thumbnail?.small",
    currentTrack && (currentTrack.thumbnail?.large || currentTrack.thumbnail?.medium || currentTrack.thumbnail?.small)
  )

  const background = React.useMemo(() => {
    if (currentTrack && currentTrack.thumbnail) {
      if (currentTrack.thumbnail.large) {
        return currentTrack.thumbnail.large
      } else if (currentTrack.thumbnail.medium) {
        return currentTrack.thumbnail.medium
      } else if (currentTrack.thumbnail.small) {
        return currentTrack.thumbnail.small
      } else {
        return "unset"
      }
    } else {
      return "unset"
    }
  }, [currentTrack])

  const disabled = !available || queueIDs.length === 0

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      style={{
        ...style,
        backgroundImage: `url("${background}")`,
        backgroundSize: "100% 100%",
        borderRadius: 8,
        height: "100%"
      }}
    >
      <Grid item xs={12}>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              alignItems: "center",
              borderRadius: 18,
              background: currentTrack ? "#060404d4" : undefined,
              display: "flex",
              flexDirection: "column",
              padding: 16,
              width: "fit-content"
            }}
          >
            {currentTrack ? (
              <>
                <Typography gutterBottom variant="h5" component="h2" color="textSecondary">
                  {SpotifyHelper.isSpotifyTrack(currentTrack)
                    ? `${currentTrack.title} - ${currentTrack.artists}`
                    : currentTrack.title}
                </Typography>
                <Button color="primary" onClick={() => window.open(currentTrack.url, "_blank")}>
                  Watch on Youtube
                </Button>
              </>
            ) : (
              <>
                <Typography gutterBottom variant="h5" component="h2">
                  No song playing right now...
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  You can add one above.
                </Typography>
              </>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} style={{ padding: 16 }}>
        <Grid container direction="row" justify="center">
          <Grid item>
            <SkipPreviousButton disabled={disabled} onClick={() => dispatch(skipPreviousTracks(1))} />
          </Grid>
          <Grid item>
            {paused ? (
              <PlayButton disabled={disabled || !currentTrack} onClick={() => dispatch(resumePlayer())} />
            ) : (
              <PauseButton disabled={disabled || !currentTrack} onClick={() => dispatch(pausePlayer())} />
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
  )
}

export default React.memo(PlayerArea)

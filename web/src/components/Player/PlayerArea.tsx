import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import ClearAllIcon from "@material-ui/icons/ClearAll"
import QueueIcon from "@material-ui/icons/QueueMusic"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import {
  clearTracks,
  pausePlayer,
  resumePlayer,
  setPlayerVolume,
  shuffleTracks,
  skipPreviousTracks,
  skipTracks,
  updateLoopState
} from "../../redux/playerSlice"
import QueueList from "../Queue/QueueList"
import {
  LoopButton,
  PauseButton,
  PlayButton,
  ShuffleButton,
  SkipNextButton,
  SkipPreviousButton
} from "./ControlButtons"
import TrackCard from "./TrackCard"
import VolumeSlider from "./VolumeSlider"

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    flexDirection: "column",
    borderRadius: 16,
    paddingBottom: 16,
    marginTop: 16,
    position: "relative"
  },
  trackCardContainer: {
    justifyContent: "center",
    display: "flex",
    padding: 16,
    height: "65%"
  },
  actions: {
    position: "absolute",
    top: 8,
    right: 8
  }
}))

interface Props {
  style?: React.CSSProperties
}

function PlayerArea(props: Props) {
  const { style } = props

  const dispatch: AppDispatch = useDispatch()
  const { available, currentTrack, paused, queue: queueIDs, volume } = useSelector((state: RootState) => state.player)
  const { loopState } = useSelector((state: RootState) => state.player)
  const [showQueue, setShowQueue] = React.useState(false)

  const classes = useStyles()

  const disabled = !available || queueIDs.length === 0
  const containerWidth = showQueue ? "95%" : "80%"

  const switchLoopState = React.useCallback(() => {
    const newLoopState: LoopState =
      loopState === "none" ? "repeat-all" : loopState === "repeat-all" ? "repeat-one" : "none"
    dispatch(updateLoopState(newLoopState))
  }, [dispatch, loopState])

  const ClearQueueButton = React.useMemo(
    () => (
      <Tooltip title="Clear All" aria-label="clear">
        <span>
          <IconButton color="secondary" disabled={disabled} onClick={() => dispatch(clearTracks())}>
            <ClearAllIcon style={{ fontSize: "150%" }} />
          </IconButton>
        </span>
      </Tooltip>
    ),
    [disabled, dispatch]
  )

  const ToggleQueueButton = React.useMemo(
    () => (
      <Tooltip title="Show Queue" aria-label="show queue">
        <IconButton color="secondary" onClick={() => setShowQueue(!showQueue)}>
          <QueueIcon style={{ fontSize: "150%" }} />
        </IconButton>
      </Tooltip>
    ),
    [showQueue]
  )

  return (
    <>
      <Typography variant="h4" style={{ fontWeight: 500 }}>
        Now Playing
      </Typography>
      <Typography variant="body1">{queueIDs.length} items in queue</Typography>
      <Paper className={classes.paper} elevation={0} style={{...style,  height: !showQueue ? "unset" : undefined }}> 
        <div className={classes.actions}>
          {showQueue && ClearQueueButton}
          {ToggleQueueButton}
        </div>
        <Grid
          className={classes.trackCardContainer}
          item
          xs={12}
          style={{
            width: containerWidth,
            marginTop: showQueue ? 48 : undefined
          }}
        >
          {showQueue ? <QueueList /> : currentTrack ? <TrackCard currentTrack={currentTrack} /> : undefined}
        </Grid>
        <Grid item xs={12} style={{ padding: 16 }}>
          <Grid alignItems="center" container direction="row" justify="center">
            <Grid item>
              <ShuffleButton disabled={disabled} onClick={() => dispatch(shuffleTracks())} />
            </Grid>
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
            <Grid item>
              <SkipNextButton disabled={disabled} onClick={() => dispatch(skipTracks(1))} />
            </Grid>
            <Grid item>
              <LoopButton disabled={disabled} onClick={switchLoopState} />
            </Grid>
          </Grid>
          <VolumeSlider
            disabled={disabled}
            volume={volume}
            onChange={(newVolume: number) => {
              dispatch(setPlayerVolume(newVolume))
            }}
            style={{ marginTop: 16 }}
          />
        </Grid>
      </Paper>
    </>
  )
}

export default React.memo(PlayerArea)

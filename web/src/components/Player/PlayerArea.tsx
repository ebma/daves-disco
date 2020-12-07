import { makeStyles, Paper } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import {
  pausePlayer,
  resumePlayer,
  setPlayerVolume,
  shuffleTracks,
  skipPreviousTracks,
  skipTracks,
  updateLoopState
} from "../../redux/playerSlice"
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
    flexDirection: "column",
    borderRadius: 16,
    paddingBottom: 16,
    marginTop: 16
  },
  trackCardContainer: { justifyContent: "center", display: "flex", padding: 16, width: "80%" }
}))

interface Props {
  style?: React.CSSProperties
}

function PlayerArea(props: Props) {
  const { style } = props

  const dispatch: AppDispatch = useDispatch()
  const { available, currentTrack, paused, queue: queueIDs, volume } = useSelector((state: RootState) => state.player)
  const { loopState } = useSelector((state: RootState) => state.player)

  const classes = useStyles()

  const disabled = !available || queueIDs.length === 0

  const switchLoopState = React.useCallback(() => {
    const newLoopState: LoopState =
      loopState === "none" ? "repeat-all" : loopState === "repeat-all" ? "repeat-one" : "none"
    dispatch(updateLoopState(newLoopState))
  }, [dispatch, loopState])

  return (
    <>
      <Typography variant="h4" style={{ fontWeight: 500 }}>
        Now Playing
      </Typography>
      <Typography variant="body1">{queueIDs.length} items in queue</Typography>
      <Paper className={classes.paper} elevation={2} style={style}>
        <Grid className={classes.trackCardContainer} item xs={12}>
          <TrackCard />
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

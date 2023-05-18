import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import makeStyles from "@mui/material/styles/makeStyles"
import Typography from "@mui/material/Typography"
import ClearAllIcon from "@mui/icons-material/ClearAll"
import QueueIcon from "@mui/icons-material/QueueMusic"
import React from "react"
import { useDispatch } from "react-redux"
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
import { PlayerFieldsFragment, useGetTrackByIdLazyQuery } from "../../services/graphql/graphql"
import QueueList from "../Queue/QueueList"
import StyledButton from "../StyledButton"
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
    height: "65%",
    marginTop: 48
  },
  actions: {
    position: "absolute",
    top: 8,
    right: 8
  }
}))

interface Props {
  guildID: GuildID
  player: PlayerFieldsFragment
  style?: React.CSSProperties
}

function PlayerArea(props: Props) {
  const { player, guildID, style } = props

  const dispatch: AppDispatch = useDispatch()
  const { available, currentTrackID, loopState, paused, queueIDs, volume } = player
  const [showQueue, setShowQueue] = React.useState(false)

  const classes = useStyles()

  const [loadTrack, trackQuery] = useGetTrackByIdLazyQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 3000
  })

  React.useEffect(() => {
    if (currentTrackID) {
      loadTrack({ variables: { id: currentTrackID.trackModelID } })
    }
  }, [currentTrackID, loadTrack])

  const disabled = !available || queueIDs.length === 0
  const containerWidth = showQueue ? "95%" : "80%"

  const switchLoopState = React.useCallback(() => {
    const newLoopState: LoopState =
      loopState === "none" ? "repeat-all" : loopState === "repeat-all" ? "repeat-one" : "none"
    dispatch(updateLoopState(newLoopState))
  }, [dispatch, loopState])

  const ClearQueueButton = React.useMemo(
    () => (
      <StyledButton
        alignIconBefore
        icon={<ClearAllIcon style={{ fontSize: "150%" }} />}
        text="Clear All"
        onClick={() => dispatch(clearTracks())}
      />
    ),
    [dispatch]
  )

  const ToggleQueueButton = React.useMemo(
    () => (
      <StyledButton
        alignIconBefore
        icon={<QueueIcon style={{ fontSize: "160%" }} />}
        text={showQueue ? "Hide Queue" : "Show Queue"}
        onClick={() => setShowQueue(!showQueue)}
      />
    ),
    [showQueue]
  )

  return (
    <>
      <Typography variant="h4" style={{ fontWeight: 500 }}>
        Now Playing
      </Typography>
      <Typography variant="body1">{queueIDs.length} items in queue</Typography>
      <Paper className={classes.paper} elevation={0} style={{ ...style, height: !showQueue ? "unset" : undefined }}>
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
          {showQueue ? (
            <QueueList currentTrackID={currentTrackID || undefined} guildID={guildID} queueIDs={queueIDs} />
          ) : (
            currentTrackID && <TrackCard currentTrack={trackQuery.data?.trackById || undefined} paused={paused} />
          )}
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
                <PlayButton disabled={disabled || !currentTrackID} onClick={() => dispatch(resumePlayer())} />
              ) : (
                <PauseButton disabled={disabled || !currentTrackID} onClick={() => dispatch(pausePlayer())} />
              )}
            </Grid>
            <Grid item>
              <SkipNextButton disabled={disabled} onClick={() => dispatch(skipTracks(1))} />
            </Grid>
            <Grid item>
              <LoopButton disabled={disabled} loopState={loopState as LoopState} onClick={switchLoopState} />
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

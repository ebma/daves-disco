import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import ClearIcon from "@material-ui/icons/Clear"
import RepeatIcon from "@material-ui/icons/Repeat"
import RepeatOneIcon from "@material-ui/icons/RepeatOne"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { clearTracks, shuffleTracks, updateLoopState } from "../../redux/playerSlice"
import QueueList from "./QueueList"

const useStyles = makeStyles(theme => ({
  button: {
    margin: 16
  },
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),

    [theme.breakpoints.down("sm")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  buttonBox: {
    display: "flex",

    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      flexWrap: "wrap"
    }
  },
  headerTitle: {
    marginLeft: 16,
    marginTop: 16
  }
}))

interface QueueHeaderProps {
  onClearClick: () => void
  onShuffleClick: () => void
  onLoopClick: () => void
  showButtons: boolean
  loopState: LoopState
}

function QueueHeader(props: QueueHeaderProps) {
  const { onClearClick, onShuffleClick, onLoopClick, loopState, showButtons } = props
  const classes = useStyles()

  const loopTooltipTitle =
    loopState === "none" ? "Don't repeat" : loopState === "repeat-one" ? "Repeat Track" : "Repeat"

  const loopIcon =
    loopState === "none" ? (
      <RepeatIcon color="disabled" />
    ) : loopState === "repeat-one" ? (
      <RepeatOneIcon />
    ) : (
      <RepeatIcon />
    )

  return (
    <div className={classes.container}>
      <Typography className={classes.headerTitle} color="textPrimary" variant="h3">
        Queue
      </Typography>
      {showButtons && (
        <Box className={classes.buttonBox}>
          <Tooltip arrow placement="top" title="Clear">
            <Button
              className={classes.button}
              color="secondary"
              onClick={onClearClick}
              startIcon={<ClearIcon />}
              variant="contained"
            >
              Clear
            </Button>
          </Tooltip>
          <Tooltip arrow placement="top" title="Shuffle">
            <Button
              className={classes.button}
              color="secondary"
              onClick={onShuffleClick}
              startIcon={<ShuffleIcon />}
              variant="contained"
            >
              Shuffle
            </Button>
          </Tooltip>
          <Tooltip arrow placement="top" title={loopTooltipTitle}>
            <Button
              className={classes.button}
              color="secondary"
              onClick={onLoopClick}
              startIcon={loopIcon}
              variant="contained"
            >
              Repeat
            </Button>
          </Tooltip>
        </Box>
      )}
    </div>
  )
}

function QueueArea() {
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { loopState, queue } = useSelector((state: RootState) => state.player)

  const shuffle = React.useCallback(() => {
    if (user) {
      dispatch(shuffleTracks())
    }
  }, [dispatch, user])

  const clear = React.useCallback(() => {
    if (user) {
      dispatch(clearTracks())
    }
  }, [dispatch, user])

  const switchLoopState = React.useCallback(() => {
    if (user) {
      const newLoopState: LoopState =
        loopState === "none" ? "repeat-all" : loopState === "repeat-all" ? "repeat-one" : "none"
      dispatch(updateLoopState(newLoopState))
    }
  }, [dispatch, loopState, user])

  return (
    <>
      <QueueHeader
        onClearClick={clear}
        onShuffleClick={shuffle}
        onLoopClick={switchLoopState}
        loopState={loopState}
        showButtons={queue.length > 0}
      />
      <QueueList />
    </>
  )
}

export default QueueArea

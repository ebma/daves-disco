import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
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

interface QueueHeaderProps {
  onClearClick: () => void
  onShuffleClick: () => void
  onLoopClick: () => void
  loopState: LoopState
}

function QueueHeader(props: QueueHeaderProps) {
  const { onClearClick, onShuffleClick, onLoopClick, loopState } = props

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
    <Box display="flex">
      <Tooltip arrow placement="top" title="Clear">
        <Button
          variant="contained"
          color="secondary"
          onClick={onClearClick}
          startIcon={<ClearIcon />}
          style={{ margin: 16 }}
        >
          Clear
        </Button>
      </Tooltip>
      <Tooltip arrow placement="top" title="Shuffle">
        <Button
          variant="contained"
          color="secondary"
          onClick={onShuffleClick}
          startIcon={<ShuffleIcon />}
          style={{ margin: 16 }}
        >
          Shuffle
        </Button>
      </Tooltip>
      <Tooltip arrow placement="top" title={loopTooltipTitle}>
        <Button variant="contained" color="secondary" onClick={onLoopClick} startIcon={loopIcon} style={{ margin: 16 }}>
          Repeat
        </Button>
      </Tooltip>
    </Box>
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
      <div style={{ alignItems: "center", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <Typography color="textPrimary" variant="h3" style={{ marginLeft: 16, marginTop: 16 }}>
          Queue
        </Typography>
        {queue.length > 0 && (
          <QueueHeader
            onClearClick={clear}
            onShuffleClick={shuffle}
            onLoopClick={switchLoopState}
            loopState={loopState}
          />
        )}
      </div>
      <QueueList />
    </>
  )
}

export default QueueArea

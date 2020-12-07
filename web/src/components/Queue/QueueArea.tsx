import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import ClearIcon from "@material-ui/icons/Clear"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { clearTracks } from "../../redux/playerSlice"
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
  showButtons: boolean
}

function QueueHeader(props: QueueHeaderProps) {
  const { onClearClick, showButtons } = props
  const classes = useStyles()

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
        </Box>
      )}
    </div>
  )
}

function QueueArea() {
  const dispatch: AppDispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.user)
  const { queue } = useSelector((state: RootState) => state.player)

  const clear = React.useCallback(() => {
    if (user) {
      dispatch(clearTracks())
    }
  }, [dispatch, user])

  return (
    <>
      <QueueHeader onClearClick={clear} showButtons={queue.length > 0} />
      <QueueList />
    </>
  )
}

export default QueueArea

import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import QueueList from "./QueueList"
import { SocketContext } from "../../context/socket"
import { Messages } from "../../shared/ipc"

const useStyles = makeStyles(theme => ({
  paper: {
    paddingTop: 8,
    padding: 16
  }
}))

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
  guildID: string
}

function QueueArea(props: Props) {
  const classes = useStyles()

  const { currentTrack, currentQueue, guildID } = props

  const { sendMessage } = React.useContext(SocketContext)
  const [show, setShow] = React.useState(true)

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  const shuffle = React.useCallback(() => {
    sendMessage(Messages.Shuffle, guildID)
  }, [guildID, sendMessage])

  const shuffleItem = React.useMemo(
    () => (
      <Tooltip arrow placement="top" title="Shuffle">
        <IconButton onClick={shuffle}>
          <ShuffleIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    ),
    [shuffle]
  )

  const expandItem = React.useMemo(() => {
    const expandLessIcon = (
      <Tooltip arrow placement="top" title="Hide">
        <IconButton onClick={toggleShow}>
          <ExpandLessIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    const expandMoreIcon = (
      <Tooltip arrow placement="top" title="Show">
        <IconButton onClick={toggleShow}>
          <ExpandMoreIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    return show ? expandLessIcon : expandMoreIcon
  }, [show, toggleShow])

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography color="inherit" variant="h5">
            Queued songs
          </Typography>
        </Grid>
        <Grid item>
          {shuffleItem}
          {expandItem}
        </Grid>
      </Grid>
      {show ? <QueueList currentQueue={currentQueue} currentTrack={currentTrack} guildID={guildID} /> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import { Avatar, Link, ListItemAvatar, makeStyles, Paper } from "@material-ui/core"
import { trackError } from "../../../shared/util/trackError"
import { SocketContext } from "../../../context/socket"

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16
  },
  queueItem: {
    position: "relative",
    padding: "16px 24px",
  }
}))

interface QueueItemProps {
  track: Track
}

function QueueItem(props: QueueItemProps) {
  const classes = useStyles()
  const { track } = props

  return (
    <ListItem button className={classes.queueItem} onClick={() => window.open(track.url, "_blank")}>
      <ListItemAvatar>
        <Avatar alt="thumbnail" src={track.thumbnail} />
      </ListItemAvatar>
      <ListItemText
        primary={track.title}
        secondary={
          <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
            {track.url}
          </Link>
        }
      />
    </ListItem>
  )
}

interface Props {}

function QueueArea(props: Props) {
  const classes = useStyles()

  const { addListener, connectionState, guildID, sendControlMessage } = React.useContext(SocketContext)

  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    const unsubscribeCurrentQueue = addListener("currentQueue", setCurrentQueue)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentQueue")
        .then(setCurrentQueue)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentQueue()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  const listContent = React.useMemo(() => {
    return currentQueue.length > 0 ? (
      currentQueue.map((track, index) => <QueueItem track={track} key={index}></QueueItem>)
    ) : (
      <ListItem onClick={() => undefined} key={0}>
        <ListItemText primary="No songs in queue..." />
      </ListItem>
    )
  }, [currentQueue])

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between" onClick={toggleShow}>
        <Grid item>
          <Typography color="inherit" variant="h5">
            Queued songs
          </Typography>
        </Grid>
        <Grid item>
          {show ? <ExpandLessIcon style={{ fontSize: 32 }} /> : <ExpandMoreIcon style={{ fontSize: 32 }} />}
        </Grid>
      </Grid>

      {show ? <List style={{ flexGrow: 1 }}>{listContent}</List> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

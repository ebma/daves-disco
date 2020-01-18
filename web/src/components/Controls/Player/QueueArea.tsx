import React from "react"
import _ from "lodash"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import ClearIcon from "@material-ui/icons/Clear"
import { Avatar, Link, ListItemAvatar, makeStyles, Paper, IconButton, Tooltip, ListItemIcon } from "@material-ui/core"
import { trackError } from "../../../shared/util/trackError"
import { SocketContext } from "../../../context/socket"

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 8,
    padding: 16
  },
  queueItem: {
    position: "relative",
    padding: "16px 24px"
  }
}))

interface QueueItemProps {
  old?: boolean
  current?: boolean
  track: Track
}

function QueueItem(props: QueueItemProps) {
  const classes = useStyles()
  const { track } = props

  const listItemStyle: React.CSSProperties = props.old ? { opacity: 0.5 } : {}

  return (
    <ListItem
      button
      className={classes.queueItem}
      onClick={() => window.open(track.url, "_blank")}
      style={listItemStyle}
    >
      {props.current ? (
        <ListItemIcon>
          <Tooltip placement="left" title="Current">
            <ArrowForwardIcon />
          </Tooltip>
        </ListItemIcon>
      ) : (
        undefined
      )}
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

  const { addListener, connectionState, guildID, sendCommand, sendControlMessage } = React.useContext(SocketContext)

  const [currentTrack, setCurrentTrack] = React.useState<Track | undefined>(undefined)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    const unsubscribeCurrentTrack = addListener("currentTrack", setCurrentTrack)
    const unsubscribeCurrentQueue = addListener("currentQueue", setCurrentQueue)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentTrack")
        .then(setCurrentTrack)
        .catch(trackError)
      sendControlMessage("getCurrentQueue")
        .then(setCurrentQueue)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentTrack()
      unsubscribeCurrentQueue()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  const listContent = React.useMemo(() => {
    const indexOfCurrentSong = currentTrack
      ? currentQueue.findIndex(track => _.isEqual(track, currentTrack))
      : currentQueue.length

    return currentQueue.length > 0 ? (
      currentQueue.map((track, index) => (
        <QueueItem
          current={index === indexOfCurrentSong}
          old={index < indexOfCurrentSong}
          track={track}
          key={index}
        ></QueueItem>
      ))
    ) : (
      <ListItem onClick={() => undefined} key={0}>
        <ListItemText primary="No songs in queue..." />
      </ListItem>
    )
  }, [currentQueue, currentTrack])

  const itemRow = React.useMemo(() => {
    const expandLessIcon = (
      <Tooltip arrow placement="top" title="Hide">
        <IconButton>
          <ExpandLessIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    const expandMoreIcon = (
      <Tooltip arrow placement="top" title="Show">
        <IconButton>
          <ExpandMoreIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    return (
      <>
        <Tooltip arrow placement="top" title="Stop">
          <IconButton
            onClick={event => {
              event.stopPropagation()
              sendCommand("stop")
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        {show ? expandLessIcon : expandMoreIcon}
      </>
    )
  }, [sendCommand, show])

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between" onClick={toggleShow} alignItems="center">
        <Grid item>
          <Typography color="inherit" variant="h5">
            Queued songs
          </Typography>
        </Grid>
        <Grid item>{itemRow}</Grid>
      </Grid>

      {show ? <List style={{ flexGrow: 1 }}>{listContent}</List> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

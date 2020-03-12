import React, { useRef } from "react"
import _ from "lodash"
import Avatar from "@material-ui/core/Avatar"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Link from "@material-ui/core/Link"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import Paper from "@material-ui/core/Paper"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { SocketContext } from "../../context/socket"

const useStyles = makeStyles(theme => ({
  paper: {
    paddingTop: 8,
    padding: 16
  },
  queueItem: {
    boxShadow: "1",
    position: "relative",
    padding: "16px 24px"
  },
  queueList: {
    flexGrow: 1,
    maxHeight: 500,
    overflow: "auto"
  }
}))

interface QueueItemProps {
  current?: boolean
  old?: boolean
  track: Track
  onClick?: () => void
}

function QueueItem(props: QueueItemProps) {
  const classes = useStyles()
  const { current, old, track, onClick } = props

  const myRef = useRef<HTMLDivElement>(null)
  if (current) {
    setTimeout(() => {
      myRef.current && myRef.current.scrollIntoView()
    }, 500)
  }

  const listItemStyle: React.CSSProperties = old ? { opacity: 0.5 } : {}

  return (
    <ListItem button className={classes.queueItem} onClick={onClick} ref={myRef} style={listItemStyle}>
      {current ? (
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

function QueueList(props: Props) {
  const classes = useStyles()

  const { currentTrack, currentQueue } = props
  const { sendCommand } = React.useContext(SocketContext)

  const indexOfCurrentSong = currentTrack
    ? currentQueue.findIndex(track => _.isEqual(track, currentTrack))
    : currentQueue.length

  return (
    <List className={classes.queueList}>
      {currentQueue.length > 0 ? (
        currentQueue.map((track, index) => {
          const onClick =
            index < indexOfCurrentSong
              ? () => sendCommand("skip-previous", indexOfCurrentSong - index)
              : index > indexOfCurrentSong
              ? () => sendCommand("skip", index - indexOfCurrentSong)
              : undefined

          return (
            <>
              {index > 0 ? <Divider variant="inset" component="li" /> : undefined}
              <QueueItem
                current={index === indexOfCurrentSong}
                key={index}
                old={index < indexOfCurrentSong}
                track={track}
                onClick={onClick}
              />
            </>
          )
        })
      ) : (
        <ListItem onClick={() => undefined} key={0}>
          <ListItemText primary="No songs in queue..." />
        </ListItem>
      )}
    </List>
  )
}

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
}

function QueueArea(props: Props) {
  const classes = useStyles()

  const { currentTrack, currentQueue } = props

  const [show, setShow] = React.useState(true)

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

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

    return show ? expandLessIcon : expandMoreIcon
  }, [show])

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
      {show ? <QueueList currentQueue={currentQueue} currentTrack={currentTrack} /> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

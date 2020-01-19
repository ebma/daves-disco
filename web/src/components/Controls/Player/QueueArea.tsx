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
import {
  Avatar,
  Link,
  ListItemAvatar,
  makeStyles,
  Paper,
  IconButton,
  Tooltip,
  ListItemIcon,
  Divider
} from "@material-ui/core"
import { SocketContext } from "../../../context/socket"

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 8,
    padding: 16
  },
  queueItem: {
    boxShadow: "1",
    position: "relative",
    padding: "16px 24px"
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

  const listItemStyle: React.CSSProperties = old ? { opacity: 0.5 } : {}

  return (
    <ListItem button className={classes.queueItem} onClick={onClick} style={listItemStyle}>
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

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
}

function QueueArea(props: Props) {
  const classes = useStyles()

  const { currentTrack, currentQueue } = props

  const { sendCommand } = React.useContext(SocketContext)
  const [show, setShow] = React.useState(true)

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  const listContent = React.useMemo(() => {
    const indexOfCurrentSong = currentTrack
      ? currentQueue.findIndex(track => _.isEqual(track, currentTrack))
      : currentQueue.length

    return currentQueue.length > 0 ? (
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
              old={index < indexOfCurrentSong}
              track={track}
              key={index}
              onClick={onClick}
            />
          </>
        )
      })
    ) : (
      <ListItem onClick={() => undefined} key={0}>
        <ListItemText primary="No songs in queue..." />
      </ListItem>
    )
  }, [currentQueue, currentTrack, sendCommand])

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

      {show ? <List style={{ flexGrow: 1 }}>{listContent}</List> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

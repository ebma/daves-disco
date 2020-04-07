import React, { useRef } from "react"
import { Draggable } from "react-beautiful-dnd"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Link from "@material-ui/core/Link"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip"
import DeleteIcon from "@material-ui/icons/Delete"
import { SpotifyHelper } from "../../shared/utils/helpers"

const useStyles = makeStyles(theme => ({
  queueItem: {
    boxShadow: "1",
    position: "relative",
    padding: 0
  },
  avatar: {
    minHeight: "64px",
    minWidth: "64px"
  },
  text: {
    padding: "0px 24px"
  }
}))

interface Props {
  current?: boolean
  id: string
  index: number
  old?: boolean
  track: Track
  onClick?: () => void
  onDeleteClick?: () => void
}

function QueueItem(props: Props) {
  const classes = useStyles()
  const { current, id, index, old, track, onClick, onDeleteClick } = props

  const myRef = useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (current) {
      setTimeout(() => {
        myRef.current && myRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 500)
    }
  }, [current])

  const DeleteTrackButton = React.useMemo(() => {
    return onDeleteClick ? (
      <ListItemIcon
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          onDeleteClick()
        }}
      >
        <Tooltip placement="left" title="Remove">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
    ) : (
      undefined
    )
  }, [onDeleteClick])

  const listItemStyle: React.CSSProperties = old ? { opacity: 0.5 } : {}

  const primaryText = SpotifyHelper.isSpotifyTrack(track) ? `${track.title} - ${track.artists}` : track.title

  return (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <ListItem
          button
          className={classes.queueItem}
          ref={provided.innerRef}
          onClick={onClick}
          selected={current}
          style={listItemStyle}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemAvatar ref={myRef}>
            <Avatar
              alt="thumbnail"
              className={classes.avatar}
              src={track.thumbnail?.small || track.thumbnail?.medium || track.thumbnail?.large}
              variant="square"
            />
          </ListItemAvatar>
          <ListItemText
            className={classes.text}
            primary={primaryText}
            primaryTypographyProps={{
              style: {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              }
            }}
            secondary={
              track.url && (
                <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
                  {track.url}
                </Link>
              )
            }
          />
          {DeleteTrackButton}
        </ListItem>
      )}
    </Draggable>
  )
}

export default React.memo(QueueItem)

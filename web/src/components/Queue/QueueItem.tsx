import React, { useRef } from "react"
import Avatar from "@material-ui/core/Avatar"
import Link from "@material-ui/core/Link"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip"
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos"
import { Draggable } from "react-beautiful-dnd"

const useStyles = makeStyles(theme => ({
  queueItem: {
    boxShadow: "1",
    position: "relative",
    padding: "16px 24px"
  }
}))

interface Props {
  current?: boolean
  id: string
  index: number
  old?: boolean
  track: Track
  onClick?: () => void
}

function QueueItem(props: Props) {
  const classes = useStyles()
  const { current, id, index, old, track, onClick } = props

  const myRef = useRef<HTMLDivElement>(null)
  if (current) {
    setTimeout(() => {
      myRef.current && myRef.current.scrollIntoView()
    }, 500)
  }

  const listItemStyle: React.CSSProperties = old ? { opacity: 0.5 } : {}

  return (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <ListItem
          button
          className={classes.queueItem}
          ref={provided.innerRef}
          onClick={onClick}
          style={listItemStyle}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
      )}
    </Draggable>
  )
}

export default QueueItem

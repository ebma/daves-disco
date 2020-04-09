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
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import { SpotifyHelper } from "../../../shared/utils/helpers"

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
  favourite?: boolean
  track: Track
  onClick?: () => void
  onDeleteClick?: () => void
  toggleFavourite?: () => void
}

export const TrackItem = React.forwardRef(function TrackItem(props: Props, ref: React.Ref<HTMLDivElement>) {
  const classes = useStyles()
  const { current, favourite, track, onClick, onDeleteClick, toggleFavourite } = props

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

  const FavorTrackButton = React.useMemo(() => {
    return toggleFavourite ? (
      <ListItemIcon
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          toggleFavourite()
        }}
      >
        {favourite ? (
          <Tooltip placement="bottom" title="Remove from favourites">
            <IconButton>
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip placement="bottom" title="Add to favourites">
            <IconButton>
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>
        )}
      </ListItemIcon>
    ) : (
      undefined
    )
  }, [favourite, toggleFavourite])

  const primaryText = SpotifyHelper.isSpotifyTrack(track) ? `${track.title} - ${track.artists}` : track.title

  return (
    <ListItem button className={classes.queueItem} onClick={onClick} ref={ref} selected={current}>
      <ListItemAvatar>
        <Avatar
          alt="thumbnail"
          className={classes.avatar}
          src={track.thumbnail?.small ?? track.thumbnail?.medium ?? track.thumbnail?.large}
          variant="square"
        />
      </ListItemAvatar>
      <ListItemText
        className={classes.text}
        primaryTypographyProps={{
          style: {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }
        }}
        secondaryTypographyProps={{
          style: {
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }
        }}
        primary={primaryText}
        secondary={
          track.url && (
            <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
              {track.url}
            </Link>
          )
        }
      />
      {DeleteTrackButton}
      {FavorTrackButton}
    </ListItem>
  )
})

interface DraggableTrackItemProps {
  current?: boolean
  id: string
  index: number
  old?: boolean
  track: Track
  onClick?: () => void
  onDeleteClick?: () => void
}

export function DraggableTrackItem(props: DraggableTrackItemProps) {
  const { current, id, index } = props

  const myRef = useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (current) {
      setTimeout(() => {
        myRef.current && myRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 500)
    }
  }, [current])

  return (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <TrackItem {...props} ref={myRef} />
        </div>
      )}
    </Draggable>
  )
}

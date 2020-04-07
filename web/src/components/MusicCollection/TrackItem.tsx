import React from "react"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Link from "@material-ui/core/Link"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import Tooltip from "@material-ui/core/Tooltip"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
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
  favourite?: boolean
  track: Track
  onClick?: () => void
  onDeleteClick?: () => void
  toggleFavourite?: () => void
}

function TrackItem(props: Props) {
  const classes = useStyles()
  const { favourite, track, onClick, toggleFavourite } = props

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

  console.log("track.thumbnail", track.thumbnail)

  return (
    <ListItem button className={classes.queueItem} onClick={onClick}>
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
        primary={primaryText}
        secondary={
          <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
            {track.url}
          </Link>
        }
      />
      {FavorTrackButton}
    </ListItem>
  )
}

export default React.memo(TrackItem)

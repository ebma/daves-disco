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
import ListIcon from "@material-ui/icons/List"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import { SpotifyHelper } from "../../../shared/utils/helpers"
import { updatePlaylist } from "../../../redux/playlistsSlice"
import { AppDispatch } from "../../../app/store"
import { useDispatch } from "react-redux"

const useStyles = makeStyles(theme => ({
  queueItem: {
    boxShadow: "1",
    position: "relative",
    padding: 0
  },
  avatar: {
    minHeight: "64px",
    height: "100%",
    minWidth: "64px"
  },
  text: {
    padding: "0px 24px"
  }
}))

interface Props {
  playlist: PlaylistModel
  onClick?: () => void
  showFavourite?: boolean
}

function PlaylistItem(props: Props) {
  const { playlist, onClick, showFavourite } = props
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()

  const ShowListButton = React.useMemo(
    () => (
      <ListItemIcon
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          onClick && onClick()
        }}
      >
        <Tooltip placement="bottom" title="View Playlist">
          <IconButton>
            <ListIcon />
          </IconButton>
        </Tooltip>
      </ListItemIcon>
    ),
    [onClick]
  )

  const toggleFavourite = React.useCallback(() => {
    dispatch(updatePlaylist({ ...playlist, favourite: !playlist.favourite }))
  }, [dispatch, playlist])

  const FavorPlaylistButton = React.useMemo(() => {
    return showFavourite ? (
      <ListItemIcon
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()
          toggleFavourite()
        }}
      >
        {playlist.favourite ? (
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
  }, [showFavourite, playlist.favourite, toggleFavourite])

  const secondaryText = React.useMemo(
    () =>
      playlist.url ? (
        <Link href={playlist.url} color="inherit" target="_blank" rel="noreferrer">
          {playlist.url}
        </Link>
      ) : playlist.uri ? (
        <Link
          href={`https://open.spotify.com/playlist/${SpotifyHelper.getIDFromUri(playlist.uri)}`}
          color="inherit"
          target="_blank"
          rel="noreferrer"
        >
          {playlist.uri}
        </Link>
      ) : (
        ""
      ),
    [playlist.uri, playlist.url]
  )

  return (
    <ListItem button className={classes.queueItem} onClick={onClick}>
      <ListItemAvatar>
        <Avatar
          alt="thumbnail"
          className={classes.avatar}
          src={playlist.thumbnail?.small || playlist.thumbnail?.medium || playlist.thumbnail?.large}
          variant="square"
        />
      </ListItemAvatar>
      <ListItemText
        className={classes.text}
        primary={playlist.name}
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
        secondary={secondaryText}
      />
      {ShowListButton}
      {FavorPlaylistButton}
    </ListItem>
  )
}

export default React.memo(PlaylistItem)

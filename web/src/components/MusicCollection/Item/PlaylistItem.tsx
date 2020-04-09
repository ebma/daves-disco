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
import { SpotifyHelper } from "../../../shared/utils/helpers"

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
  favourite?: boolean
  playlist: Playlist
  onClick?: () => void
  toggleFavourite?: () => void
}

function PlaylistItem(props: Props) {
  const classes = useStyles()
  const { playlist, onClick } = props

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
        secondary={secondaryText}
      />
      {ShowListButton}
    </ListItem>
  )
}

export default React.memo(PlaylistItem)

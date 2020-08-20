import Avatar from "@material-ui/core/Avatar"
import Link from "@material-ui/core/Link"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../app/store"
import { updatePlaylist } from "../../../redux/playlistsSlice"
import { SpotifyHelper } from "../../../shared/utils/helpers"
import { FavorButton, ShowListButton } from "./Buttons"

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
  guildID: GuildID
  onClick?: () => void
  showFavourite?: boolean
}

function PlaylistItem(props: Props) {
  const { guildID, playlist, onClick, showFavourite } = props
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()

  const toggleFavourite = React.useCallback(() => {
    const favouriteCopy = playlist.favourite.slice()
    const toggledFavouriteCopy = favouriteCopy.map(value => {
      if (value.guild === guildID) {
        return { ...value, favourite: !value.favourite }
      } else {
        return value
      }
    })
    dispatch(updatePlaylist({ ...playlist, favourite: toggledFavouriteCopy }))
  }, [dispatch, guildID, playlist])

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
      {onClick ? <ShowListButton onClick={onClick} /> : undefined}
      {showFavourite ? (
        <FavorButton
          onClick={toggleFavourite}
          favourite={playlist.favourite.find(value => value.guild === guildID)?.favourite || false}
        />
      ) : (
        undefined
      )}
    </ListItem>
  )
}

export default React.memo(PlaylistItem)

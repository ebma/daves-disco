import Avatar from "@material-ui/core/Avatar"
import Link from "@material-ui/core/Link"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemText from "@material-ui/core/ListItemText"
import Paper from "@material-ui/core/Paper"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../app/store"
import { updatePlaylist } from "../../../redux/playlistsSlice"
import { SpotifyHelper } from "../../../shared/utils/helpers"
import { FavorButton, ShowListButton } from "./Buttons"

const useStyles = makeStyles(theme => ({
  item: {
    boxShadow: "1",
    position: "relative",
    padding: 0
  },
  avatar: {
    borderRadius: 8,
    minHeight: "64px",
    height: "100%",
    minWidth: "64px"
  },
  paper: {
    alignItems: "center",
    display: "flex",
    marginTop: 8,
    marginBottom: 8,
    width: "100%"
  }
}))

interface Props {
  playlist: PlaylistModel
  guildID: GuildID
  onClick?: () => void
  showFavourite?: boolean
  thumbnailSize?: number
}

function PlaylistItem(props: Props) {
  const { guildID, playlist, onClick, showFavourite, thumbnailSize = 78 } = props
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
    <Paper className={classes.paper} elevation={0}>
      <ListItem className={classes.item}>
        <ListItemAvatar>
          <Avatar
            alt="thumbnail"
            className={classes.avatar}
            src={playlist.thumbnail?.small || playlist.thumbnail?.medium || playlist.thumbnail?.large}
            variant="square"
            style={{ minWidth: thumbnailSize, minHeight: thumbnailSize }}
          />
        </ListItemAvatar>
        {onClick && <ShowListButton onClick={onClick} style={{ marginLeft: 8 }} />}
        <ListItemText
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
        {showFavourite && (
          <FavorButton
            onClick={toggleFavourite}
            favourite={playlist.favourite.find(value => value.guild === guildID)?.favourite || false}
          />
        )}
      </ListItem>
    </Paper>
  )
}

export default React.memo(PlaylistItem)

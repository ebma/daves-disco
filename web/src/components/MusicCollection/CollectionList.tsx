import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import { makeStyles } from "@material-ui/core/styles"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import RefreshIcon from "@material-ui/icons/Cached"
import PlayIcon from "@material-ui/icons/PlayArrow"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { NotificationsContext } from "../../context/notifications"
import { fetchPlaylistByID, playPlaylist } from "../../redux/playlistsSlice"
import { playTrack } from "../../redux/tracksSlice"
import PlaylistItem from "./Item/PlaylistItem"
import { TrackItem } from "./Item/TrackItem"

function isTrack(item: MusicItem): item is TrackModel {
  return (item as TrackModel).title !== undefined
}

function isPlaylist(item: MusicItem): item is PlaylistModel {
  return (item as PlaylistModel).name !== undefined
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16,
    paddingTop: 8,
    overflow: "auto"
  },
  headerContainer: {
    justifyContent: "left",
    display: "flex",
    flexWrap: "wrap",

    [theme.breakpoints.down("xs")]: {
      justifyContent: "center"
    }
  },
  headerButton: {
    margin: 16,

    [theme.breakpoints.down("xs")]: {
      margin: 8,
      width: "70%"
    }
  }
}))

interface PlaylistHeaderProps {
  onBack?: () => void
  onEnqueueAll?: () => void
  onRefresh?: () => void
}

function PlaylistHeader(props: PlaylistHeaderProps) {
  const { onBack, onEnqueueAll, onRefresh } = props
  const classes = useStyles()

  return (
    <Box className={classes.headerContainer}>
      {onBack && (
        <Button
          className={classes.headerButton}
          variant="contained"
          color="secondary"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      )}
      {onEnqueueAll && (
        <Button
          className={classes.headerButton}
          color="secondary"
          onClick={onEnqueueAll}
          startIcon={<PlayIcon />}
          variant="contained"
        >
          Enqueue All
        </Button>
      )}
      {onRefresh && (
        <Button
          className={classes.headerButton}
          color="secondary"
          onClick={onRefresh}
          startIcon={<RefreshIcon />}
          variant="contained"
        >
          Refresh
        </Button>
      )}
    </Box>
  )
}

interface MusicItemListProps {
  guildID: GuildID
  items: MusicItem[]
  onTrackSelect: (track: TrackModel) => void
  onPlaylistSelect: (playlist: PlaylistModel) => void
}

const MusicItemList = React.memo(function MusicItemList(props: MusicItemListProps) {
  const { items, guildID, onPlaylistSelect, onTrackSelect } = props
  const classes = useStyles()

  const collectionItems = React.useMemo(
    () =>
      items.map((item, index) => {
        if (isTrack(item)) {
          return (
            <div key={item._id}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <TrackItem guildID={guildID} track={item} onClick={() => onTrackSelect(item)} showFavourite />
            </div>
          )
        } else if (isPlaylist(item)) {
          return (
            <div key={item._id}>
              {index > 0 && <Divider variant="inset" component="li" />}
              <PlaylistItem guildID={guildID} onClick={() => onPlaylistSelect(item)} playlist={item} showFavourite />
            </div>
          )
        } else {
          throw Error(`Unknown item ${JSON.stringify(item)}`)
        }
      }),
    [items, guildID, onPlaylistSelect, onTrackSelect]
  )

  return <List className={classes.root}>{collectionItems}</List>
})

interface Props {
  collection: MusicItem[]
}

function CollectionList(props: Props) {
  const { collection } = props

  const dispatch: AppDispatch = useDispatch()
  const { playlists } = useSelector((state: RootState) => state.playlists)
  const { user } = useSelector((state: RootState) => state.user)
  const [selectedPlaylistID, setSelectedPlaylistID] = React.useState<string | undefined>(undefined)
  const { showNotification } = React.useContext(NotificationsContext)

  const selectedPlaylist = playlists.find(playlist => playlist.id === selectedPlaylistID)

  const onTrackSelect = React.useCallback(
    (track: TrackModel) => {
      dispatch(playTrack(track)).then(() => showNotification("success", `Added '${track.title}' to queue`))
    },
    [dispatch, showNotification]
  )

  const onPlaylistSelect = React.useCallback((playlist: PlaylistModel) => {
    setSelectedPlaylistID(playlist.id)
  }, [])

  const PlaylistHeaderMemo = React.useMemo(() => {
    return selectedPlaylist ? (
      <PlaylistHeader
        onBack={() => setSelectedPlaylistID(undefined)}
        onEnqueueAll={() =>
          dispatch(playPlaylist(selectedPlaylist)).then(() =>
            showNotification("success", `Added all songs of '${selectedPlaylist.name}' to queue`)
          )
        }
        onRefresh={() =>
          dispatch(fetchPlaylistByID(selectedPlaylist._id, false)).then(() =>
            showNotification("success", `Refreshed '${selectedPlaylist.name}'`)
          )
        }
      />
    ) : (
      undefined
    )
  }, [dispatch, selectedPlaylist, showNotification])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {PlaylistHeaderMemo}
      <MusicItemList
        guildID={user?.guildID || ""}
        items={selectedPlaylist ? selectedPlaylist.tracks : collection}
        onTrackSelect={onTrackSelect}
        onPlaylistSelect={onPlaylistSelect}
      />
    </div>
  )
}

export default CollectionList

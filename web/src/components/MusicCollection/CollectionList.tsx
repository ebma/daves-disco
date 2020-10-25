import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
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
import MusicItemList from "./MusicItemList"

const useStyles = makeStyles(theme => ({
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
  },
  title: {
    alignSelf: "center",
    flexGrow: 1,
    textAlign: "center"
  }
}))

interface PlaylistHeaderProps {
  onBack?: () => void
  onEnqueueAll?: () => void
  onRefresh?: () => void
  title?: string
}

function PlaylistHeader(props: PlaylistHeaderProps) {
  const { onBack, onEnqueueAll, onRefresh, title } = props
  const classes = useStyles()

  return (
    <>
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
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
      </Box>

      <Divider variant="middle" />
    </>
  )
}

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

  const selectedPlaylist = playlists.find(playlist => playlist._id === selectedPlaylistID)

  const onTrackSelect = React.useCallback(
    (track: TrackModel) => {
      dispatch(playTrack(track)).then(() => showNotification("success", `Added '${track.title}' to queue`))
    },
    [dispatch, showNotification]
  )

  const onPlaylistSelect = React.useCallback((playlist: PlaylistModel) => {
    setSelectedPlaylistID(playlist._id)
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
        title={selectedPlaylist.name}
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

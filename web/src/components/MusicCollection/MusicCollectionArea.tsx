import React from "react"
import Paper from "@material-ui/core/Paper"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import { Theme, createStyles } from "@material-ui/core/styles"
import makeStyles from "@material-ui/styles/makeStyles"
import { SocketContext } from "../../context/socket"
import { trackError } from "../../context/notifications"
import { Messages } from "../../shared/ipc"
import CollectionList from "./CollectionList"
import TrackService from "../../services/tracks"
import PlaylistService from "../../services/playlists"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  })
)

interface MusicCollectionAreaProps {
  guildID: GuildID
  userID: UserID
}

function MusicCollectionArea(props: MusicCollectionAreaProps) {
  const { guildID, userID } = props
  const classes = useStyles()

  const { sendMessage, subscribeToMessages } = React.useContext(SocketContext)

  const [tab, setTab] = React.useState(0)
  const [recents, setRecents] = React.useState<MusicItem[]>([])
  const [favourites, setFavourites] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const fetchRecents = async () => {
      const newItems: MusicItem[] = []
      const playlists = await PlaylistService.getAll()
      const tracks = await TrackService.getAll()
      newItems.push(...playlists)
      newItems.push(...tracks)
      setRecents(newItems)
    }
    const fetchFavourites = async () => {
      const newItems: MusicItem[] = []
      const playlists = await PlaylistService.getFavourites()
      const tracks = await TrackService.getFavourites()
      newItems.push(...playlists)
      newItems.push(...tracks)
      setFavourites(newItems)
    }

    const unsubscribeRecentHistory = subscribeToMessages(Messages.RecentHistoryChange, fetchRecents)
    const unsubscribeFavourites = subscribeToMessages(Messages.FavouritesChange, fetchFavourites)

    fetchRecents()
    fetchFavourites()

    return () => {
      unsubscribeRecentHistory()
      unsubscribeFavourites()
    }
  }, [guildID, sendMessage, subscribeToMessages])

  const onSearchDone = React.useCallback(
    async input => {
      sendMessage(Messages.Play, guildID, userID, input).catch(trackError)
    },
    [guildID, userID, sendMessage]
  )

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  const items = React.useMemo(() => (tab === 0 ? recents : favourites), [favourites, recents, tab])

  return (
    <Paper className={classes.root}>
      <Tabs
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        variant="fullWidth"
        scrollButtons="auto"
        style={{ paddingLeft: 8, paddingRight: 8 }}
        value={tab}
      >
        <Tab label="Recent History" />
        <Tab label="Favourites" />
      </Tabs>
      <CollectionList collection={items} enqueue={onSearchDone} />
    </Paper>
  )
}

export default React.memo(MusicCollectionArea)

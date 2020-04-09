import React from "react"
import _ from "lodash"
import CollectionList from "./CollectionList"
import { SocketContext } from "../../context/socket"
import TrackService from "../../services/tracks"
import PlaylistService from "../../services/playlists"
import { Messages } from "../../shared/ipc"

interface RecentHistoryTabProps {
  guildID: GuildID
  enqueueTrack: (track: Track) => void
  enqueuePlaylist: (playlist: Playlist) => void
}

function RecentHistoryTab(props: RecentHistoryTabProps) {
  const { enqueueTrack, enqueuePlaylist, guildID } = props
  const { sendMessage, subscribeToMessages } = React.useContext(SocketContext)

  const [items, setItems] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const fetchRecents = async () => {
      const newItems: MusicItem[] = []
      const playlists = await PlaylistService.getAll(guildID)
      const tracks = await TrackService.getAll(guildID)
      newItems.push(...playlists)
      newItems.push(...tracks)
      setItems(newItems)
    }

    const unsubscribeRecentHistory = subscribeToMessages(Messages.RecentHistoryChange, fetchRecents)
    fetchRecents()

    return () => {
      unsubscribeRecentHistory()
    }
  }, [guildID, sendMessage, subscribeToMessages])

  return (
    <>
        <CollectionList collection={items} enqueueTrack={enqueueTrack} enqueuePlaylist={enqueuePlaylist} />
    </>
  )
}

export default RecentHistoryTab

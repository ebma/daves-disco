import React from "react"
import CollectionList from "../List/CollectionList"
import { SocketContext } from "../../../context/socket"
import TrackService from "../../../services/tracks"
import PlaylistService from "../../../services/playlists"
import { Messages } from "../../../shared/ipc"

interface FavouritesTabProps {
  guildID: GuildID
  enqueueTrack: (track: Track) => void
  enqueuePlaylist: (playlist: Playlist) => void
}

function FavouritesTab(props: FavouritesTabProps) {
  const { enqueueTrack, enqueuePlaylist, guildID } = props
  const { sendMessage, subscribeToMessages } = React.useContext(SocketContext)

  const [items, setItems] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const fetchRecents = async () => {
      const newItems: MusicItem[] = []
      const playlists = await PlaylistService.getFavourites(guildID)
      const tracks = await TrackService.getFavourites(guildID)
      newItems.push(...playlists)
      newItems.push(...tracks)
      setItems(newItems)
    }

    const unsubscribeFavourites = subscribeToMessages(Messages.FavouritesChange, fetchRecents)
    fetchRecents()

    return () => {
      unsubscribeFavourites()
    }
  }, [guildID, sendMessage, subscribeToMessages])

  return (
    <>
      <CollectionList collection={items} enqueueTrack={enqueueTrack} enqueuePlaylist={enqueuePlaylist} />
    </>
  )
}

export default FavouritesTab

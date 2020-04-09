import React from "react"
import { SocketContext } from "../../../context/socket"
import TrackService from "../../../services/tracks"
import PlaylistService from "../../../services/playlists"
import { Messages } from "../../../shared/ipc"
import CollectionList from "../List/CollectionList"

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

    const unsubscribeTracksChange = subscribeToMessages(Messages.TracksChange, fetchRecents)
    const unsubscribePlaylistsChange = subscribeToMessages(Messages.PlaylistsChange, fetchRecents)
    fetchRecents()

    return () => {
      unsubscribeTracksChange()
      unsubscribePlaylistsChange()
    }
  }, [guildID, sendMessage, subscribeToMessages])

  const toggleFavouriteTrack = React.useCallback((track: TrackModel) => {
    TrackService.update(track.id, { ...track, favourite: !track.favourite })
  }, [])

  const toggleFavouritePlaylist = React.useCallback((playlist: PlaylistModel) => {
    PlaylistService.update(playlist.id, { ...playlist, favourite: !playlist.favourite })
  }, [])

  return (
    <>
      <CollectionList
        collection={items}
        enqueueTrack={enqueueTrack}
        enqueuePlaylist={enqueuePlaylist}
        toggleFavouritePlaylist={toggleFavouritePlaylist}
        toggleFavouriteTrack={toggleFavouriteTrack}
      />
    </>
  )
}

export default React.memo(RecentHistoryTab)

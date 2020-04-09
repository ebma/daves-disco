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
    const fetchFavourites = async () => {
      const newItems: MusicItem[] = []
      const playlists = await PlaylistService.getFavourites(guildID)
      const tracks = await TrackService.getFavourites(guildID)
      newItems.push(...playlists)
      newItems.push(...tracks)
      setItems(newItems)
    }

    const unsubscribeTracks = subscribeToMessages(Messages.TracksChange, fetchFavourites)
    const unsubscribePlaylists = subscribeToMessages(Messages.PlaylistsChange, fetchFavourites)
    fetchFavourites()

    return () => {
      unsubscribeTracks()
      unsubscribePlaylists()
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

export default FavouritesTab

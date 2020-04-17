import React from "react"
import { useSelector } from "react-redux"
import Typography from "@material-ui/core/Typography"
import CollectionList from "../List/CollectionList"
import { RootState } from "../../../app/rootReducer"

interface FavouritesTabProps {}

function FavouritesTab(props: FavouritesTabProps) {
  const { playlists } = useSelector((state: RootState) => state.playlists)
  const { tracks } = useSelector((state: RootState) => state.tracks)

  const [items, setItems] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const newItems = []
    for (const playlist of playlists) {
      if (playlist.favourite) {
        newItems.push(playlist)
      }
    }
    for (const track of tracks) {
      if (track.favourite) {
        newItems.push(track)
      }
    }

    newItems.sort((a: MusicItem, b: MusicItem) => {
      if ((a as Track).title !== undefined && (b as Track).title !== undefined) {
        return (a as Track).title.localeCompare((b as Track).title)
      } else if ((a as Playlist).name !== undefined && (b as Playlist).name !== undefined) {
        return (a as Playlist).name.localeCompare((b as Playlist).name)
      } else {
        return 0
      }
    })

    setItems(newItems)
  }, [playlists, tracks])

  const NoItemsInfo = React.useMemo(
    () => (
      <Typography color="textPrimary" style={{ padding: 16 }}>
        No favourites yet...
      </Typography>
    ),
    []
  )

  return items.length === 0 ? NoItemsInfo : <CollectionList collection={items} />
}

export default FavouritesTab

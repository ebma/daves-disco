import React from "react"
import { useSelector } from "react-redux"
import Typography from "@material-ui/core/Typography"
import { RootState } from "../../../app/rootReducer"
import CollectionList from "../CollectionList"

interface RecentHistoryTabProps {}

function RecentHistoryTab(props: RecentHistoryTabProps) {
  const { playlists } = useSelector((state: RootState) => state.playlists)
  const { tracks } = useSelector((state: RootState) => state.tracks)

  const [items, setItems] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const newItems = []
    newItems.push(...playlists)
    newItems.push(...tracks)
    const touchedByUser = newItems.filter(item => {
      if ((item as TrackModel).touchedByUser === false) return false
      else return true
    })

    touchedByUser.sort((a: MusicItem, b: MusicItem) => {
      return new Date(b.lastTouchedAt).getTime() - new Date(a.lastTouchedAt).getTime()
    })

    const last20Items = touchedByUser.slice(0, 20)

    setItems(last20Items)
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

export default React.memo(RecentHistoryTab)

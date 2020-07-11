import Typography from "@material-ui/core/Typography"
import React from "react"
import CollectionList from "../CollectionList"

interface FavouritesTabProps {
  items: MusicItem[]
}

function FavouritesTab(props: FavouritesTabProps) {
  const { items } = props

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

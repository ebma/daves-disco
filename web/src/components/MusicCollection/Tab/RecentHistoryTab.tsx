import Typography from "@material-ui/core/Typography"
import React from "react"
import CollectionList from "../CollectionList"

interface RecentHistoryTabProps {
  items: MusicItem[]
}

function RecentHistoryTab(props: RecentHistoryTabProps) {
  const { items } = props

  const NoItemsInfo = React.useMemo(
    () => (
      <Typography color="textPrimary" style={{ padding: 16 }}>
        No recent items yet...
      </Typography>
    ),
    []
  )

  return items.length === 0 ? NoItemsInfo : <CollectionList collection={items} />
}

export default React.memo(RecentHistoryTab)

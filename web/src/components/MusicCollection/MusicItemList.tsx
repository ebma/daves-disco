import List from "@material-ui/core/List"
import makeStyles from "@material-ui/core/styles/makeStyles"
import React from "react"
import PlaylistItem from "./Item/PlaylistItem"
import { TrackItem } from "./Item/TrackItem"

function isTrack(item: MusicItem): item is TrackModel {
  return (item as TrackModel).title !== undefined
}

function isPlaylist(item: MusicItem): item is PlaylistModel {
  return (item as PlaylistModel).name !== undefined
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16,
    paddingTop: 8,
    overflow: "auto"
  }
}))

interface MusicItemListProps {
  guildID: GuildID
  items: MusicItem[]
  onTrackSelect: (track: TrackModel) => void
  onPlaylistSelect: (playlist: PlaylistModel) => void
}

const MusicItemList = React.memo(function MusicItemList(props: MusicItemListProps) {
  const { items, guildID, onPlaylistSelect, onTrackSelect } = props
  const classes = useStyles()

  const collectionItems = React.useMemo(
    () =>
      items.map((item, index) => {
        if (isTrack(item)) {
          return (
            <div key={item._id}>
              <TrackItem guildID={guildID} track={item} onClick={() => onTrackSelect(item)} showFavourite />
            </div>
          )
        } else if (isPlaylist(item)) {
          return (
            <div key={item._id}>
              <PlaylistItem guildID={guildID} onClick={() => onPlaylistSelect(item)} playlist={item} showFavourite />
            </div>
          )
        } else {
          throw Error(`Unknown item ${JSON.stringify(item)}`)
        }
      }),
    [items, guildID, onPlaylistSelect, onTrackSelect]
  )

  return <List className={classes.root}>{collectionItems}</List>
})

export default MusicItemList

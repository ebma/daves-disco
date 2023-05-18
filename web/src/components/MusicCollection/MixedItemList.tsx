import List from "@mui/material/List"
import makeStyles from "@mui/material/styles/makeStyles"
import React from "react"
import {
  Playlist,
  PlaylistFieldsFragment,
  PlaylistFieldsWithoutTracksFragment,
  Track,
  TrackFieldsFragment,
  useUpdateTrackByIdMutation,
  useUpdatePlaylistByIdMutation
} from "../../services/graphql/graphql"
import PlaylistItem from "./Item/PlaylistItem"
import { TrackItem } from "./Item/TrackItem"

type Item = Track | Playlist

function sortItemsByName(items: Item[]): Item[] {
  const copy = items.slice(0)
  return copy.sort((a: any, b: any) => {
    const aIdentifier = a.title ? a.title : a.name
    const bIdentifier = b.title ? b.title : b.name

    return aIdentifier.localeCompare(bIdentifier)
  })
}

function sortItemsByDate(items: Item[], guildID: GuildID): Item[] {
  const copy = items.slice(0)
  return copy.sort((a: any, b: any) => {
    const dateA = new Date(Number(a.lastTouchedAt.find((value: any) => value.guild === guildID)?.date || 0))
    const dateB = new Date(Number(b.lastTouchedAt.find((value: any) => value.guild === guildID)?.date || 0))
    return dateB.getTime() - dateA.getTime()
  })
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: 16,
    paddingTop: 8,
    overflow: "auto"
  }
}))

interface MixedItemListProps {
  guildID: GuildID
  tracks: TrackFieldsFragment[]
  playlists?: PlaylistFieldsWithoutTracksFragment[]
  onTrackSelect?: (track: TrackFieldsFragment) => void
  onPlaylistSelect?: (playlist: PlaylistFieldsWithoutTracksFragment) => void
  limit?: number
  sort?: "date" | "name" | "none"
}

const MixedItemList = React.memo(function MusicItemList(props: MixedItemListProps) {
  const {
    tracks,
    playlists,
    limit,
    guildID,
    onPlaylistSelect = () => undefined,
    onTrackSelect = () => undefined,
    sort
  } = props
  const classes = useStyles()

  const [items, setItems] = React.useState<Item[]>([])

  const [updateTrack] = useUpdateTrackByIdMutation({})
  const [updatePlaylist] = useUpdatePlaylistByIdMutation({})

  const toggleFavouriteTrack = React.useCallback(
    (track: TrackFieldsFragment) => {
      const toggledFavourite = track.favourite?.map(fav =>
        fav?.guild === props.guildID ? { guild: fav.guild, favourite: !fav.favourite } : fav
      )
      const updatedPartial = { favourite: toggledFavourite }
      updateTrack({ variables: { id: track._id, record: updatedPartial } })
    },
    [props.guildID, updateTrack]
  )

  const toggleFavouritePlaylist = React.useCallback(
    (playlist: PlaylistFieldsFragment) => {
      const toggledFavourite = playlist.favourite?.map(fav =>
        fav?.guild === props.guildID ? { guild: fav.guild, favourite: !fav.favourite } : fav
      )
      const updatedPartial = { favourite: toggledFavourite }
      updatePlaylist({ variables: { id: playlist._id, record: updatedPartial } })
    },
    [props.guildID, updatePlaylist]
  )

  React.useEffect(() => {
    let array: Item[] = tracks
    if (playlists) {
      array = array.concat(playlists)
    }

    const sortedItems =
      sort === "date" ? sortItemsByDate(array, props.guildID) : sort === "name" ? sortItemsByName(array) : array
    if (limit) {
      setItems(sortedItems.slice(0, limit))
    } else {
      setItems(sortedItems)
    }
  }, [tracks, playlists, sort, limit, props.guildID])

  return (
    <List className={classes.root}>
      {items.map(item => {
        if (item.__typename === "Track") {
          const track = item as Track
          return (
            <TrackItem
              key={track._id}
              guildID={guildID}
              track={track}
              onClick={() => onTrackSelect(track)}
              toggleFavourite={toggleFavouriteTrack}
              showFavourite
            />
          )
        } else {
          const playlist = item as Playlist
          return (
            <PlaylistItem
              key={playlist._id}
              guildID={guildID}
              playlist={playlist}
              onClick={() => onPlaylistSelect(playlist)}
              toggleFavourite={toggleFavouritePlaylist}
              showFavourite
            />
          )
        }
      })}
    </List>
  )
})

export default MixedItemList

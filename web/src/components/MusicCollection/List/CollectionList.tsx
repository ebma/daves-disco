import React from "react"
import List from "@material-ui/core/List"
import { TrackItem } from "../Item/TrackItem"
import PlaylistItem from "../Item/PlaylistItem"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import FavoriteIcon from "@material-ui/icons/Favorite"
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder"
import PlayIcon from "@material-ui/icons/PlayArrow"
import PlaylistService from "../../../services/playlists"
import { trackError } from "../../../context/notifications"

function isTrack(item: MusicItem): item is TrackModel {
  return (item as TrackModel).title !== undefined
}

function isPlaylist(item: MusicItem): item is PlaylistModel {
  return (item as PlaylistModel).name !== undefined
}

const useStyles = makeStyles({
  root: {
    padding: 16,
    maxHeight: 500,
    overflowY: "auto"
  }
})

interface PlaylistHeaderProps {
  favourite: boolean
  onBack: () => void
  onEnqueueAll: () => void
  onToggleFavourite: () => void
}

function PlaylistHeader(props: PlaylistHeaderProps) {
  const { favourite, onBack, onEnqueueAll, onToggleFavourite } = props

  return (
    <Box display="flex">
      <Button
        variant="contained"
        color="secondary"
        onClick={onBack}
        startIcon={<ArrowBackIcon />}
        style={{ margin: 16 }}
      >
        Go Back
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onEnqueueAll}
        startIcon={<PlayIcon />}
        style={{ margin: 16 }}
      >
        Enqueue All
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={onToggleFavourite}
        startIcon={favourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        style={{ margin: 16 }}
      >
        {favourite ? "Remove from favourites" : "Add to favourites"}
      </Button>
    </Box>
  )
}

interface MusicItemListProps {
  items: MusicItem[]
  onTrackSelect: (track: TrackModel) => void
  onPlaylistSelect: (playlist: PlaylistModel) => void
}

const MusicItemList = React.memo(function MusicItemList(props: MusicItemListProps) {
  const { items, onPlaylistSelect, onTrackSelect } = props
  const classes = useStyles()

  const collectionItems = React.useMemo(
    () =>
      items.map(item => {
        if (isTrack(item)) {
          return (
            <TrackItem
              key={item.id}
              favourite={item.favourite}
              track={item}
              onClick={() => onTrackSelect(item)}
              toggleFavourite={() => undefined}
            />
          )
        } else if (isPlaylist(item)) {
          return (
            <PlaylistItem
              key={item.id}
              favourite={item.favourite}
              onClick={() => onPlaylistSelect(item)}
              playlist={item}
              toggleFavourite={() => undefined}
            />
          )
        } else {
          throw Error(`Unknown item ${item}`)
        }
      }),
    [items, onPlaylistSelect, onTrackSelect]
  )

  return <List className={classes.root}>{collectionItems}</List>
})

interface Props {
  collection: MusicItem[]
  enqueueTrack: (track: Track) => void
  enqueuePlaylist: (playlist: Playlist) => void
}

function CollectionList(props: Props) {
  const { collection, enqueueTrack, enqueuePlaylist } = props

  const [selectedPlaylist, setSelectedPlaylist] = React.useState<PlaylistModel | null>(null)

  const selectedTracks = selectedPlaylist?.tracks?.map(track => ({ ...track, guild: "" }))

  const onEnqueueAll = React.useCallback(() => {
    if (selectedPlaylist) {
      enqueuePlaylist(selectedPlaylist)
    }
  }, [enqueuePlaylist, selectedPlaylist])

  const onTrackSelect = React.useCallback(
    (track: TrackModel) => {
      enqueueTrack(track)
    },
    [enqueueTrack]
  )

  const onPlaylistSelect = React.useCallback((playlist: PlaylistModel) => {
    PlaylistService.get(playlist.id)
      .then(setSelectedPlaylist)
      .catch(trackError)
  }, [])

  const NoItemsInfo = React.useMemo(
    () => (
      <Typography color="textPrimary" style={{ padding: 16 }}>
        No items yet...
      </Typography>
    ),
    []
  )

  return (
    <>
      {collection.length === 0 && NoItemsInfo}
      {selectedPlaylist && (
        <PlaylistHeader
          favourite={selectedPlaylist.favourite || false}
          onBack={() => setSelectedPlaylist(null)}
          onEnqueueAll={onEnqueueAll}
          onToggleFavourite={() => undefined}
        />
      )}
      <MusicItemList
        items={selectedTracks ? selectedTracks : collection}
        onTrackSelect={onTrackSelect}
        onPlaylistSelect={onPlaylistSelect}
      />
    </>
  )
}

export default CollectionList

import React from "react"
import List from "@material-ui/core/List"
import { TrackItem } from "../Item/TrackItem"
import PlaylistItem from "../Item/PlaylistItem"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
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
    paddingTop: 8,
  }
})

interface PlaylistHeaderProps {
  onBack: () => void
  onEnqueueAll: () => void
}

function PlaylistHeader(props: PlaylistHeaderProps) {
  const { onBack, onEnqueueAll } = props

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
    </Box>
  )
}

interface MusicItemListProps {
  items: MusicItem[]
  toggleFavouriteTrack: (track: TrackModel) => void
  toggleFavouritePlaylist: (playlist: PlaylistModel) => void
  onTrackSelect: (track: TrackModel) => void
  onPlaylistSelect: (playlist: PlaylistModel) => void
}

const MusicItemList = React.memo(function MusicItemList(props: MusicItemListProps) {
  const { items, onPlaylistSelect, onTrackSelect, toggleFavouriteTrack, toggleFavouritePlaylist } = props
  const classes = useStyles()

  const collectionItems = React.useMemo(
    () =>
      items.map((item, index) => {
        if (isTrack(item)) {
          return (
            <>
              {index > 0 && <Divider variant="inset" component="li" />}
              <TrackItem
                key={item.id}
                favourite={item.favourite}
                track={item}
                onClick={() => onTrackSelect(item)}
                toggleFavourite={() => toggleFavouriteTrack(item)}
              />
            </>
          )
        } else if (isPlaylist(item)) {
          return (
            <>
              {index > 0 && <Divider variant="inset" component="li" />}
              <PlaylistItem
                key={item.id}
                favourite={item.favourite}
                onClick={() => onPlaylistSelect(item)}
                playlist={item}
                toggleFavourite={() => toggleFavouritePlaylist(item)}
              />
            </>
          )
        } else {
          throw Error(`Unknown item ${JSON.stringify(item)}`)
        }
      }),
    [items, onPlaylistSelect, onTrackSelect, toggleFavouritePlaylist, toggleFavouriteTrack]
  )

  return <List className={classes.root}>{collectionItems}</List>
})

interface Props {
  collection: MusicItem[]
  enqueueTrack: (track: Track) => void
  enqueuePlaylist: (playlist: Playlist) => void
  toggleFavouriteTrack: (track: TrackModel) => void
  toggleFavouritePlaylist: (playlist: PlaylistModel) => void
}

function CollectionList(props: Props) {
  const { collection, enqueueTrack, enqueuePlaylist, toggleFavouritePlaylist, toggleFavouriteTrack } = props

  const [selectedPlaylist, setSelectedPlaylist] = React.useState<PlaylistModel | null>(null)

  const selectedTracks = selectedPlaylist?.tracks?.map(track => ({ ...track, guild: selectedPlaylist.guild }))

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
      {selectedPlaylist && <PlaylistHeader onBack={() => setSelectedPlaylist(null)} onEnqueueAll={onEnqueueAll} />}
      <MusicItemList
        items={selectedTracks ? selectedTracks : collection}
        onTrackSelect={onTrackSelect}
        onPlaylistSelect={onPlaylistSelect}
        toggleFavouritePlaylist={toggleFavouritePlaylist}
        toggleFavouriteTrack={toggleFavouriteTrack}
      />
    </>
  )
}

export default CollectionList

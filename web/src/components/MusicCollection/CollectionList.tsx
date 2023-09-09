import React from "react"
import { AppDispatch, useAppDispatch } from "../../app/store";
import { NotificationsContext } from "../../context/notifications"
import { playPlaylist } from "../../redux/playlistsSlice"
import { playTrack } from "../../redux/tracksSlice"
import {
  PlaylistFieldsWithoutTracksFragment,
  TrackFieldsFragment,
  useGetPlaylistByIdUpdatedLazyQuery
} from "../../services/graphql/graphql"
import QueryWrapper from "../QueryWrapper/QueryWrapper"
import MixedItemList from "./MixedItemList"
import PlaylistList from "./PlaylistList"

interface Props {
  guildID: GuildID
  tracks: TrackFieldsFragment[]
  playlists: PlaylistFieldsWithoutTracksFragment[]
  limit?: number
  sort?: "date" | "name"
}

function CollectionList(props: Props) {
  const { limit, tracks, playlists } = props

  const [selectedPlaylistID, setSelectedPlaylistID] = React.useState<string | undefined>(undefined)
  const { showNotification } = React.useContext(NotificationsContext)

  const selectedPlaylist = playlists.find(playlist => playlist._id === selectedPlaylistID)

  const [loadPlaylist, playlistByIDQuery] = useGetPlaylistByIdUpdatedLazyQuery({
    fetchPolicy: "cache-and-network"
  })
  const dispatch: AppDispatch = useAppDispatch()

  const onTrackSelect = React.useCallback(
    (track: TrackFieldsFragment) => {
      dispatch(playTrack(track)).then(() => showNotification("success", `Added '${track.title}' to queue`))
    },
    [dispatch, showNotification]
  )

  const onEnqueueAll = React.useCallback(
    (playlist: PlaylistFieldsWithoutTracksFragment) =>
      dispatch(playPlaylist(playlist)).then(() =>
        showNotification("success", `Added all songs of '${playlist.name}' to queue`)
      ),
    [dispatch, showNotification]
  )

  const onPlaylistSelect = React.useCallback(
    (playlist: PlaylistFieldsWithoutTracksFragment) => {
      setSelectedPlaylistID(playlist._id)
      loadPlaylist({ variables: { id: playlist._id } })
    },
    [loadPlaylist]
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {selectedPlaylist ? (
        <QueryWrapper loading={playlistByIDQuery.loading} error={playlistByIDQuery.error}>
          {playlistByIDQuery.data && playlistByIDQuery.data.playlistByIdUpdated && (
            <PlaylistList
              guildID={props.guildID}
              playlist={playlistByIDQuery.data.playlistByIdUpdated}
              onBack={() => setSelectedPlaylistID(undefined)}
              onEnqueueAll={onEnqueueAll}
              onTrackSelect={onTrackSelect}
            />
          )}
        </QueryWrapper>
      ) : (
        <MixedItemList
          guildID={props.guildID}
          tracks={tracks}
          playlists={playlists}
          onTrackSelect={onTrackSelect}
          onPlaylistSelect={onPlaylistSelect}
          limit={limit}
          sort={props.sort}
        />
      )}
    </div>
  )
}

export default React.memo(CollectionList)

import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { skipPreviousTracks, skipTracks } from "../../redux/playerSlice"
import {
  TrackFieldsFragment,
  useGetTracksByIdsQuery,
  useUpdateQueueMutation,
  useUpdateTrackByIdMutation
} from "../../services/graphql/graphql"
import { DraggableTrackItem } from "../MusicCollection/Item/TrackItem"

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

interface QueueListItemProps {
  index: number
  current: boolean
  id: any
  guildID: GuildID
  old: boolean
  onClick: () => void
  onDeleteClick: () => void
  toggleFavourite: (track: TrackFieldsFragment) => void
  track: TrackFieldsFragment
}

function QueueListItem(props: QueueListItemProps) {
  const { index } = props

  return (
    <>
      {index > 0 ? <Divider variant="inset" component="li" /> : undefined}
      <DraggableTrackItem showFavourite {...props} thumbnailSize={62} />
    </>
  )
}

const useStyles = makeStyles(theme => ({
  queueList: {
    width: "100%",
    height: "100%",
    overflow: "auto",

    display: "flex",
    flexDirection: "column"
  },
  loadMoreButton: {
    alignSelf: "center"
  }
}))

interface Props {
  currentTrackID?: QueuedTrack
  guildID: GuildID
  queueIDs: QueuedTrack[]
}

function QueueList(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()

  const queueTracksQuery = useGetTracksByIdsQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 2000,
    variables: { ids: props.queueIDs.map(queueID => queueID.trackModelID) }
  })

  const [updateQueueMutation] = useUpdateQueueMutation({})

  const [localQueue, setLocalQueue] = React.useState<TrackFieldsFragment[]>([])
  const indexOfCurrentSong = React.useMemo(
    () =>
      props.currentTrackID
        ? props.queueIDs.findIndex(
            track =>
              track.trackModelID === props.currentTrackID?.trackModelID && track.uuid === props.currentTrackID?.uuid
          )
        : props.queueIDs.length,
    [props.currentTrackID, props.queueIDs]
  )

  const [updateTrack] = useUpdateTrackByIdMutation({})
  const toggleFavourite = React.useCallback(
    (track: TrackFieldsFragment) => {
      const toggledFavourite = track.favourite?.map(fav =>
        fav?.guild === props.guildID ? { guild: fav.guild, favourite: !fav.favourite } : fav
      )
      const updatedPartial = { favourite: toggledFavourite }
      updateTrack({ variables: { id: track._id, record: updatedPartial } })
    },
    [props.guildID, updateTrack]
  )

  React.useEffect(() => {
    if (queueTracksQuery.data) {
      const fetchedTracks = queueTracksQuery.data.trackByIds
      // sort response items to correct order
      const orderedResponse = props.queueIDs.reduce<TrackFieldsFragment[]>((prev, current) => {
        const correspondingItem = fetchedTracks.find(track => track._id === current.trackModelID)
        if (correspondingItem) {
          return prev.concat(correspondingItem)
        } else {
          return prev
        }
      }, [])
      setLocalQueue(orderedResponse)
    }
  }, [queueTracksQuery.data, props.queueIDs])

  const QueueItems = React.useMemo(() => {
    return localQueue.slice(0).map((track, index) => {
      const onClick =
        index < indexOfCurrentSong
          ? () => dispatch(skipPreviousTracks(indexOfCurrentSong - index))
          : index > indexOfCurrentSong
          ? () => dispatch(skipTracks(index - indexOfCurrentSong))
          : () => undefined

      const onDeleteClick = () => {
        const copiedQueue = props.queueIDs.slice(0).filter((_, i) => i !== index)

        updateQueueMutation({
          variables: {
            guild: props.guildID,
            queueIDs: copiedQueue.map(v => ({ trackModelID: v.trackModelID, uuid: v.uuid }))
          }
        })
      }

      // make id unique by combining trackmodelID and uuid
      const id = props.queueIDs[index].trackModelID + props.queueIDs[index].uuid

      return (
        <QueueListItem
          current={index === indexOfCurrentSong}
          id={id}
          key={index}
          guildID={props.guildID}
          index={index}
          old={index < indexOfCurrentSong}
          onClick={onClick}
          onDeleteClick={onDeleteClick}
          toggleFavourite={toggleFavourite}
          track={track}
        />
      )
    })
  }, [dispatch, indexOfCurrentSong, localQueue, props.guildID, props.queueIDs, updateQueueMutation, toggleFavourite])

  const EmptyQueueItem = React.useMemo(
    () => (
      <Typography align="center" variant="h5">
        -
      </Typography>
    ),
    []
  )

  const onDragStart = React.useCallback(() => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100)
    }
  }, [])

  const onDragEnd = React.useCallback(
    (result: DropResult) => {
      if (!result.destination || result.destination.index === result.source.index) {
        return
      }

      const orderedQueue = reorder(localQueue, result.source.index, result.destination.index)
      setLocalQueue(orderedQueue)
      const orderedQueueIDs = reorder(props.queueIDs, result.source.index, result.destination.index)
      updateQueueMutation({
        variables: {
          guild: props.guildID,
          queueIDs: orderedQueueIDs.map(v => ({ trackModelID: v.trackModelID, uuid: v.uuid }))
        }
      })
    },
    [localQueue, updateQueueMutation, props.guildID, props.queueIDs]
  )

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="queue-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={classes.queueList}>
            <List>{localQueue.length > 0 ? QueueItems : EmptyQueueItem}</List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QueueList

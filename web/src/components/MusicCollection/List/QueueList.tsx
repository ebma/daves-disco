import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import _ from "lodash"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import { DraggableTrackItem } from "../Item/TrackItem"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import { RootState } from "../../../app/rootReducer"
import { AppDispatch } from "../../../app/store"
import { skipTracks, skipPreviousTracks, updateQueue } from "../../../redux/playerSlice"

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const useStyles = makeStyles(theme => ({
  queueList: {
    padding: 16,
    paddingTop: 8,
    width: "100%"
  }
}))

interface Props {}

function QueueList(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()
  const { currentTrack, queue } = useSelector((state: RootState) => state.player, shallowEqual)

  const [localQueue, setLocalQueue] = React.useState<TrackModel[]>(queue)

  React.useEffect(() => {
    setLocalQueue(queue)
  }, [queue])

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
      dispatch(updateQueue(orderedQueue.map(track => track._id)))
    },
    [dispatch, localQueue]
  )

  const QueueItems = React.useMemo(() => {
    const indexOfCurrentSong = currentTrack
      ? localQueue.findIndex(track => _.isEqual(track, currentTrack))
      : localQueue.length

    return localQueue.map((trackModel, index) => {
      const onClick =
        index < indexOfCurrentSong
          ? () => dispatch(skipPreviousTracks(indexOfCurrentSong - index))
          : index > indexOfCurrentSong
          ? () => dispatch(skipTracks(index - indexOfCurrentSong))
          : undefined

      const onDeleteClick = () => {
        // dispatch(removeFromQueue(index))
        const copiedQueue = localQueue.slice(0)
        _.remove(copiedQueue, element => element.id === trackModel.id)

        dispatch(updateQueue(copiedQueue.map(track => track._id)))
      }

      return (
        <div key={index}>
          {index > 0 ? <Divider variant="inset" component="li" /> : undefined}
          <DraggableTrackItem
            current={index === indexOfCurrentSong}
            id={trackModel.id}
            index={index}
            old={index < indexOfCurrentSong}
            onClick={onClick}
            onDeleteClick={onDeleteClick}
            showFavourite
            track={trackModel}
          />
        </div>
      )
    })
  }, [currentTrack, dispatch, localQueue])

  const EmptyQueueItem = React.useMemo(
    () => (
      <ListItem onClick={() => undefined} key={0}>
        <ListItemText primary="No songs in queue..." />
      </ListItem>
    ),
    []
  )

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="queue-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={classes.queueList}>
            <List>{queue.length > 0 ? QueueItems : EmptyQueueItem}</List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QueueList

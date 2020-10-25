import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/styles/makeStyles"
import _ from "lodash"
import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { skipPreviousTracks, skipTracks, updateQueue } from "../../redux/playerSlice"
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
  track: TrackModel
}

function QueueListItem(props: QueueListItemProps) {
  const { index } = props

  return (
    <>
      {index > 0 ? <Divider variant="inset" component="li" /> : undefined}
      <DraggableTrackItem showFavourite {...props} />
    </>
  )
}

const useStyles = makeStyles(theme => ({
  queueList: {
    padding: 16,
    paddingTop: 8,
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

interface Props {}

function QueueList(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()
  const { currentTrack, queue } = useSelector((state: RootState) => state.player, shallowEqual)
  const { user } = useSelector((state: RootState) => state.user)

  const [localQueue, setLocalQueue] = React.useState<TrackModel[]>(queue)
  const [itemLimit, setItemLimit] = React.useState(20)

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

    return localQueue.slice(0, itemLimit).map((trackModel, index) => {
      const onClick =
        index < indexOfCurrentSong
          ? () => dispatch(skipPreviousTracks(indexOfCurrentSong - index))
          : index > indexOfCurrentSong
          ? () => dispatch(skipTracks(index - indexOfCurrentSong))
          : () => undefined

      const onDeleteClick = () => {
        const copiedQueue = localQueue.slice(0).filter((_, i) => i !== index)

        dispatch(updateQueue(copiedQueue.map(track => track._id)))
      }

      return (
        <QueueListItem
          current={index === indexOfCurrentSong}
          id={trackModel._id}
          key={index}
          guildID={user?.guildID || ""}
          index={index}
          old={index < indexOfCurrentSong}
          onClick={onClick}
          onDeleteClick={onDeleteClick}
          track={trackModel}
        />
      )
    })
  }, [currentTrack, dispatch, itemLimit, localQueue, user])

  const EmptyQueueItem = React.useMemo(
    () => (
      <Typography align="center" variant="h5">
        -
      </Typography>
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
            {queue.length > itemLimit ? (
              <Button className={classes.loadMoreButton} onClick={() => setItemLimit(prev => prev + 20)}>
                Load more
              </Button>
            ) : (
              undefined
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QueueList

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
      <DraggableTrackItem showFavourite {...props} thumbnailSize={62} />
    </>
  )
}

const useLoadMoreButtonStyles = makeStyles(theme => ({
  loadMoreButton: {
    alignSelf: "center"
  }
}))

function LoadMoreButton(props: { onClick: () => void }) {
  const classes = useLoadMoreButtonStyles()
  return (
    <Button className={classes.loadMoreButton} onClick={props.onClick}>
      Show more
    </Button>
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

function getInitialQueueItemRange(indexOfCurrentSong: number) {
  const lower = Math.floor(indexOfCurrentSong / 20) * 20
  const upper = (Math.floor(indexOfCurrentSong / 20) + 1) * 20
  return { lower, upper }
}

interface Props {}

function QueueList(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()
  const { currentTrack, queue } = useSelector((state: RootState) => state.player, shallowEqual)
  const { user } = useSelector((state: RootState) => state.user)

  const [localQueue, setLocalQueue] = React.useState<TrackModel[]>(queue)
  const [userInteractionWithLoadMore, setUserInteractionWithLoadMore] = React.useState(false)
  const indexOfCurrentSong = React.useMemo(
    () => (currentTrack ? localQueue.findIndex(track => _.isEqual(track, currentTrack)) : localQueue.length),
    [currentTrack, localQueue]
  )
  const [queueItemRange, setQueueItemRange] = React.useState<{ upper: number; lower: number }>(
    getInitialQueueItemRange(indexOfCurrentSong)
  )

  React.useEffect(() => {
    setLocalQueue(queue)
  }, [queue])

  React.useEffect(() => {
    // don't change range if user modified it via buttons
    if (userInteractionWithLoadMore) return

    if (
      indexOfCurrentSong > queueItemRange.upper ||
      (indexOfCurrentSong < queueItemRange.lower && queueItemRange.lower > 0)
    ) {
      setQueueItemRange(getInitialQueueItemRange(indexOfCurrentSong))
    }
  }, [indexOfCurrentSong, userInteractionWithLoadMore, queueItemRange])

  const QueueItems = React.useMemo(() => {
    return localQueue.slice(queueItemRange.lower, queueItemRange.upper).map((trackModel, index) => {
      const adjustedIndex = index + queueItemRange.lower
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
          current={adjustedIndex === indexOfCurrentSong}
          id={trackModel._id}
          key={adjustedIndex}
          guildID={user?.guildID || ""}
          index={adjustedIndex}
          old={adjustedIndex < indexOfCurrentSong}
          onClick={onClick}
          onDeleteClick={onDeleteClick}
          track={trackModel}
        />
      )
    })
  }, [dispatch, indexOfCurrentSong, queueItemRange, localQueue, user])

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
      dispatch(updateQueue(orderedQueue.map(track => track._id)))
    },
    [dispatch, localQueue]
  )

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <Droppable droppableId="queue-list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={classes.queueList}>
            {queueItemRange.lower > 0 && (
              <LoadMoreButton
                onClick={() => {
                  setQueueItemRange(prev => ({ lower: prev.lower - 20, upper: prev.upper }))
                  setUserInteractionWithLoadMore(true)
                }}
              />
            )}
            <List>{queue.length > 0 ? QueueItems : EmptyQueueItem}</List>
            {provided.placeholder}
            {queueItemRange.upper < queue.length && (
              <>
                <Divider style={{ marginBottom: 8 }} />
                <LoadMoreButton
                  onClick={() => {
                    setQueueItemRange(prev => ({ lower: prev.lower, upper: prev.upper + 20 }))
                    setUserInteractionWithLoadMore(true)
                  }}
                />
              </>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QueueList

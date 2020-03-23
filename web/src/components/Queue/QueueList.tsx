import React from "react"
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd"
import _ from "lodash"
import Divider from "@material-ui/core/Divider"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import makeStyles from "@material-ui/styles/makeStyles"
import { SocketContext } from "../../context/socket"
import { trackError } from "../../context/notifications"
import QueueItem from "./QueueItem"
import { Messages } from "../../shared/ipc"

function reorder<T>(list: Array<T>, startIndex: number, endIndex: number) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const useStyles = makeStyles(theme => ({
  queueList: {
    flexGrow: 1,
    maxHeight: 500,
    overflowY: "auto"
  }
}))

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
}

function QueueList(props: Props) {
  const { currentTrack, currentQueue } = props

  const classes = useStyles()
  const { guildID, sendMessage } = React.useContext(SocketContext)
  const [localQueue, setLocalQueue] = React.useState<Track[]>(props.currentQueue)

  React.useEffect(() => {
    setLocalQueue(props.currentQueue)
  }, [props.currentQueue])

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
      sendMessage(Messages.UpdateQueue, guildID, orderedQueue)
    },
    [guildID, localQueue, sendMessage]
  )

  const indexOfCurrentSong = currentTrack
    ? localQueue.findIndex(track => _.isEqual(track, currentTrack))
    : localQueue.length

  const QueueItems = React.useMemo(
    () =>
      localQueue.map((track, index) => {
        const onClick =
          index < indexOfCurrentSong
            ? () => sendMessage(Messages.SkipPrevious, guildID, indexOfCurrentSong - index)
            : index > indexOfCurrentSong
            ? () => sendMessage(Messages.Skip, guildID, index - indexOfCurrentSong)
            : undefined

        const onDeleteClick = () => {
          const copiedQueue = localQueue.slice(0)
          _.remove(copiedQueue, element => element.trackID === track.trackID)

          sendMessage(Messages.UpdateQueue, guildID, copiedQueue)
        }

        return (
          <div key={index}>
            {index > 0 ? <Divider variant="inset" component="li" /> : undefined}
            <QueueItem
              current={index === indexOfCurrentSong}
              id={track.trackID}
              index={index}
              old={index < indexOfCurrentSong}
              track={track}
              onClick={onClick}
              onDeleteClick={onDeleteClick}
            />
          </div>
        )
      }),
    [indexOfCurrentSong, guildID, localQueue, sendMessage]
  )

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
            <List>{currentQueue.length > 0 ? QueueItems : EmptyQueueItem}</List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default QueueList

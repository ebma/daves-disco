import React from "react"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import Tooltip from "@material-ui/core/Tooltip"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import { SocketContext } from "../../../context/socket"
import { Messages } from "../../../shared/ipc"
import { GuildContext } from "../../../context/guild"
import { trackError } from "../../../context/notifications"
import QueueList from "../List/QueueList"

interface QueueHeaderProps {
  onShuffleClick: () => void
}

function QueueHeader(props: QueueHeaderProps) {
  const { onShuffleClick } = props

  return (
    <Box display="flex">
      <Tooltip arrow placement="top" title="Shuffle">
        <Button
          variant="contained"
          color="secondary"
          onClick={onShuffleClick}
          startIcon={<ShuffleIcon />}
          style={{ margin: 16 }}
        >
          Shuffle
        </Button>
      </Tooltip>
    </Box>
  )
}

interface QueueTabProps {
  guildID: GuildID
}

function QueueTab(props: QueueTabProps) {
  const { guildID } = props
  const { sendMessage, subscribeToMessages } = React.useContext(SocketContext)
  const { isPlayerAvailable } = React.useContext(GuildContext)

  const [currentTrack, setCurrentTrack] = React.useState<Track | undefined>(undefined)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])

  React.useEffect(() => {
    const unsubscribeCurrentTrack = subscribeToMessages(Messages.CurrentTrack, setCurrentTrack)
    const unsubscribeCurrentQueue = subscribeToMessages(Messages.CurrentQueue, setCurrentQueue)

    if (isPlayerAvailable(guildID)) {
      sendMessage(Messages.GetTrack, guildID)
        .then(setCurrentTrack)
        .catch(trackError)
      sendMessage(Messages.GetQueue, guildID)
        .then(setCurrentQueue)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentTrack()
      unsubscribeCurrentQueue()
    }
  }, [guildID, isPlayerAvailable, sendMessage, subscribeToMessages])

  const shuffle = React.useCallback(() => {
    sendMessage(Messages.Shuffle, guildID)
  }, [guildID, sendMessage])

  return (
    <>
      <QueueHeader onShuffleClick={shuffle} />
      <Box padding="0px 16px">
        <QueueList currentQueue={currentQueue} currentTrack={currentTrack} guildID={guildID} />
      </Box>
    </>
  )
}

export default QueueTab

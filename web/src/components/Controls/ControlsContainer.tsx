import React from "react"
import { Container, Box } from "@material-ui/core"
import { SocketContext } from "../../context/socket"
import ConnectionStateIndicator from "../ConnectionStateIndicator"
import EnqueueArea from "./Player/EnqueueArea"
import QueueArea from "./Player/QueueArea"
import GuildSelectionCard from "./GuildSelection"
import ControlsArea from "./Player/ControlsArea"
import { trackError } from "../../shared/util/trackError"

interface ControlAreaProps {}

function ControlsContainer(props: ControlAreaProps) {
  const { addListener, connectionState, guildID, userID, sendControlMessage } = React.useContext(SocketContext)

  const [currentTrack, setCurrentTrack] = React.useState<Track | undefined>(undefined)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])

  React.useEffect(() => {
    const unsubscribeCurrentTrack = addListener("currentTrack", setCurrentTrack)
    const unsubscribeCurrentQueue = addListener("currentQueue", setCurrentQueue)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentTrack")
        .then(setCurrentTrack)
        .catch(trackError)
      sendControlMessage("getCurrentQueue")
        .then(setCurrentQueue)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentTrack()
      unsubscribeCurrentQueue()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  return (
    <Container>
      <ConnectionStateIndicator />
      <Box style={{ marginTop: 8, marginBottom: 8 }}>
        {connectionState === "connected" ? <GuildSelectionCard /> : undefined}
      </Box>
      {connectionState === "connected" && userID ? (
        <>
          <ControlsArea currentQueue={currentQueue} currentTrack={currentTrack} disabled={currentQueue.length === 0} />
          <EnqueueArea />
          <QueueArea currentQueue={currentQueue} currentTrack={currentTrack} />
        </>
      ) : (
        undefined
      )}
    </Container>
  )
}

export default React.memo(ControlsContainer)

import React from "react"
import { Container, Box } from "@material-ui/core"
import { SocketContext } from "../../context/socket"
import ConnectionStateIndicator from "../ConnectionStateIndicator"
import EnqueueArea from "./Player/EnqueueArea"
import QueueArea from "./Player/QueueArea"
import GuildSelectionCard from "./GuildSelection"
import ControlsArea from "./Player/ControlsArea"

interface ControlAreaProps {}

function ControlsContainer(props: ControlAreaProps) {
  const { connectionState, userID } = React.useContext(SocketContext)

  return (
    <Container>
      <ConnectionStateIndicator />
      <Box style={{ marginTop: 8, marginBottom: 8 }}>
        {connectionState === "connected" ? <GuildSelectionCard /> : undefined}
      </Box>
      {connectionState === "connected" && userID ? (
        <>
          <ControlsArea />
          <EnqueueArea />
          <QueueArea />
        </>
      ) : (
        undefined
      )}
    </Container>
  )
}

export default React.memo(ControlsContainer)

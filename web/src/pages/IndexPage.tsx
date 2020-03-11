import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ConnectionStateIndicator from "../components/ConnectionStateIndicator"
import { SocketContext } from "../context/socket"
import { trackError } from "../context/notifications"
import GuildSelectionCard from "../components/Controls/GuildSelection"
import EnqueueArea from "../components/Controls/Player/EnqueueArea"
import QueueArea from "../components/Controls/Player/QueueArea"
import ControlsArea from "../components/Controls/Player/ControlsArea"

function IndexPage() {
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
    <Container component="main" style={{ maxWidth: "85vw", minHeight: "100vh" }}>
      <CssBaseline />
      <Header />
      <ConnectionStateIndicator />

      <Grid container spacing={4} style={{ marginTop: 16 }}>
        <Grid item md={userID ? 6 : 12} sm={12}>
          {connectionState === "connected" ? <GuildSelectionCard /> : undefined}
        </Grid>
        {connectionState === "connected" && userID ? (
          <>
            <Grid item md={6} sm={12}>
              <EnqueueArea />
            </Grid>
            <Grid item md={6} sm={12}>
              <ControlsArea
                currentQueue={currentQueue}
                currentTrack={currentTrack}
                disabled={currentQueue.length === 0}
              />
            </Grid>
            <Grid item md={6} sm={12} style={{width: "100%"}}>
              <QueueArea currentQueue={currentQueue} currentTrack={currentTrack} />
            </Grid>
          </>
        ) : (
          undefined
        )}
      </Grid>
      <Footer />
    </Container>
  )
}

export default IndexPage

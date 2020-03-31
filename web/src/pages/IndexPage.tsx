import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ConnectionStateIndicator from "../components/ConnectionState/ConnectionStateIndicator"
import { GuildContext } from "../context/guild"
import { SocketContext } from "../context/socket"
import { trackError } from "../context/notifications"
import GuildSelectionArea from "../components/GuildSelection/GuildSelectionArea"
import SearchArea from "../components/SearchArea/SearchArea"
import QueueArea from "../components/Queue/QueueArea"
import PlayerArea from "../components/Player/PlayerArea"
import { Messages } from "../shared/ipc"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "95vw",
    minHeight: "100vh"
  },
  container: {
    marginTop: 16
  },
  item: {
    width: "100%"
  }
}))

function IndexPage() {
  const classes = useStyles()

  const { guildID, userID, isPlayerAvailable } = React.useContext(GuildContext)
  const { authenticated, connectionState, sendMessage, subscribeToMessages } = React.useContext(SocketContext)

  const [currentTrack, setCurrentTrack] = React.useState<Track | undefined>(undefined)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])

  React.useEffect(() => {
    const unsubscribeCurrentTrack = subscribeToMessages(Messages.CurrentTrack, setCurrentTrack)
    const unsubscribeCurrentQueue = subscribeToMessages(Messages.CurrentQueue, setCurrentQueue)

    if (connectionState === "connected" && guildID && isPlayerAvailable(guildID)) {
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
  }, [connectionState, guildID, isPlayerAvailable, sendMessage, subscribeToMessages])

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <ConnectionStateIndicator />

      <Grid className={classes.container} container spacing={4}>
        <Grid className={classes.item} item md={userID && authenticated ? 6 : 12} sm={12}>
          {connectionState === "connected" ? <GuildSelectionArea /> : undefined}
        </Grid>
        {connectionState === "connected" && authenticated && guildID && userID ? (
          <>
            <Grid className={classes.item} item md={6} sm={12}>
              <SearchArea guildID={guildID} userID={userID} />
            </Grid>
            <Grid className={classes.item} item md={6} sm={12}>
              <PlayerArea
                currentQueue={currentQueue}
                currentTrack={currentTrack}
                disabled={currentQueue.length === 0}
                guildID={guildID}
              />
            </Grid>
            <Grid className={classes.item} item md={6} sm={12}>
              <QueueArea currentQueue={currentQueue} currentTrack={currentTrack} guildID={guildID} />
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

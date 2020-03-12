import React from "react"
import CssBaseline from "@material-ui/core/CssBaseline"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ConnectionStateIndicator from "../components/ConnectionState/ConnectionStateIndicator"
import { SocketContext } from "../context/socket"
import { trackError } from "../context/notifications"
import GuildSelectionArea from "../components/GuildSelection/GuildSelectionArea"
import SearchArea from "../components/SearchArea/SearchArea"
import QueueArea from "../components/Queue/QueueArea"
import PlayerArea from "../components/Player/PlayerArea"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "85vw",
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
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <ConnectionStateIndicator />

      <Grid className={classes.container} container spacing={4}>
        <Grid className={classes.item} item md={userID ? 6 : 12} sm={12}>
          {connectionState === "connected" ? <GuildSelectionArea /> : undefined}
        </Grid>
        {connectionState === "connected" && userID ? (
          <>
            <Grid className={classes.item} item md={6} sm={12}>
              <SearchArea />
            </Grid>
            <Grid className={classes.item} item md={6} sm={12}>
              <PlayerArea
                currentQueue={currentQueue}
                currentTrack={currentTrack}
                disabled={currentQueue.length === 0}
              />
            </Grid>
            <Grid className={classes.item} item md={6} sm={12}>
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

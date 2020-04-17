import React from "react"
import { useSelector, useDispatch } from "react-redux"
import Box from "@material-ui/core/Box"
import CssBaseline from "@material-ui/core/CssBaseline"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/Header"
import Footer from "../components/Footer"
import GuildSelectionArea from "../components/GuildSelection/GuildSelectionArea"
import SearchArea from "../components/SearchArea/SearchArea"
import PlayerArea from "../components/Player/PlayerArea"
import MusicCollectionArea from "../components/MusicCollection/MusicCollectionArea"
import { RootState } from "../app/rootReducer"
import { fetchPlayerState, subscribePlayerState } from "../redux/playerSlice"
import { AppDispatch } from "../app/store"

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

  const dispatch: AppDispatch = useDispatch()
  const { connectionState } = useSelector((state: RootState) => state.socket)

  React.useEffect(() => {
    if (connectionState === "connected") {
      dispatch(fetchPlayerState())
    }

    const unsubscribe = dispatch(subscribePlayerState())

    return unsubscribe
  }, [connectionState, dispatch])

  return (
    <Container className={classes.root} component="main">
      <CssBaseline />
      <Header />
      <Grid className={classes.container} container spacing={4}>
        <Grid className={classes.item} item md={12} sm={12}>
          <GuildSelectionArea />
        </Grid>
        {connectionState === "authenticated" && (
          <>
            <Grid className={classes.item} item md={6} sm={12}>
              <Box display="flex" flexDirection="column" height="100%" justifyContent="space-evenly">
                <SearchArea style={{ marginBottom: 16 }} />
                <PlayerArea style={{ marginTop: 16 }} />
              </Box>
            </Grid>
            <Grid className={classes.item} item md={6} sm={12}>
              <MusicCollectionArea />
            </Grid>
          </>
        )}
      </Grid>
      <Footer />
    </Container>
  )
}

export default IndexPage

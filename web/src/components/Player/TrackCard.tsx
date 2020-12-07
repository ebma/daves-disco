import { Avatar, makeStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import NoTrackIcon from "@material-ui/icons/Remove"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { SpotifyHelper } from "../../shared/utils/helpers"

const useStyles = makeStyles({
  avatar: {
    width: 200,
    height: 200,
    "-webkit-box-reflect":
      "below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), color-stop(70%, transparent), to(rgba(250, 250, 250, 0.1)))"
  },
  noTrackIcon: {
    width: 100,
    height: 100,
    margin: 32
  },
  root: {
    alignItems: "center",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    padding: 32,
    minWidth: "50%",
    maxWidth: "80%"
  }
})

function TrackCard() {
  const classes = useStyles()

  const { currentTrack } = useSelector((state: RootState) => state.player)

  const thumbnail = React.useMemo(() => {
    if (currentTrack) {
      if (currentTrack.source === "radio") {
        return "https://images.unsplash.com/photo-1521127574-28faf1a160f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=80"
      } else if (currentTrack.thumbnail) {
        if (currentTrack.thumbnail.large) {
          return currentTrack.thumbnail.large
        } else if (currentTrack.thumbnail.medium) {
          return currentTrack.thumbnail.medium
        } else if (currentTrack.thumbnail.small) {
          return currentTrack.thumbnail.small
        } else {
          return null
        }
      }
    } else {
      return null
    }
  }, [currentTrack])

  return (
    <Paper className={classes.root} elevation={5}>
      {thumbnail ? (
        <Avatar className={classes.avatar} src={thumbnail} />
      ) : (
        <NoTrackIcon className={classes.noTrackIcon} />
      )}
      {currentTrack ? (
        <>
          <Typography align="center" gutterBottom variant="h6" color="textPrimary" style={{ marginTop: 16 }}>
            {SpotifyHelper.isSpotifyTrack(currentTrack)
              ? `${currentTrack.title} - ${currentTrack.artists}`
              : currentTrack.title}
          </Typography>
          <Button color="primary" onClick={() => window.open(currentTrack.url, "_blank")}>
            Watch on Youtube
          </Button>
        </>
      ) : (
        <Typography variant="h6">...sound of silence...</Typography>
      )}
    </Paper>
  )
}

export default TrackCard

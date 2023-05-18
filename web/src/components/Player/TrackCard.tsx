import { makeStyles } from "@mui/core"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import React from "react"
import { TrackFieldsFragment } from "../../services/graphql/graphql"
import { SpotifyHelper } from "../../shared/utils/helpers"
import { breakpoints } from "../../theme"
import AlbumCover from "./AlbumCover"

const useStyles = makeStyles({
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
    maxWidth: "80%",

    [breakpoints.down("xs")]: {
      maxWidth: "95%"
    }
  }
})

function TrackCard(props: { currentTrack?: TrackFieldsFragment; paused: boolean }) {
  const { currentTrack } = props
  const classes = useStyles()

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
          return undefined
        }
      }
    } else {
      return undefined
    }
  }, [currentTrack])

  return (
    <div className={classes.root}>
      <AlbumCover isPlaying={!props.paused} thumbnail={thumbnail} />
      {currentTrack && (
        <Typography align="center" gutterBottom variant="h6" color="textPrimary" style={{ marginTop: 16 }}>
          {SpotifyHelper.isSpotifyTrack(currentTrack as Track)
            ? `${currentTrack.title} - ${currentTrack.artists}`
            : currentTrack.title}
        </Typography>
      )}
      {currentTrack?.url && (
        <Button color="primary" onClick={() => window.open(currentTrack.url || undefined, "_blank")}>
          Watch on Youtube
        </Button>
      )}
    </div>
  )
}

export default TrackCard

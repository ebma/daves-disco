import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { makeStyles } from "@mui/styles"
import clsx from "clsx"
import React from "react"
import MusicCollectionArea from "../components/MusicCollection/MusicCollectionArea"
import PlayerArea from "../components/Player/PlayerArea"
import SearchArea from "../components/SearchArea/SearchArea"
import { PlayerFieldsFragment } from "../services/graphql/graphql"

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  fixedHeight: {
    maxHeight: "60vh",
    minHeight: "60vh"
  }
}))

interface Props {
  guildID: GuildID
  player: PlayerFieldsFragment
}

function HomePage(props: Props) {
  const { guildID, player } = props

  const classes = useStyles()

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box className={classes.paper}>
          <SearchArea style={{ marginBottom: 16 }} />
        </Box>
      </Grid>
      <Grid item xs={12} lg={7}>
        <Box className={fixedHeightPaper}>
          <MusicCollectionArea guildID={guildID} />
        </Box>
      </Grid>
      <Grid item xs={12} lg={5}>
        <Box className={fixedHeightPaper}>
          <PlayerArea guildID={guildID} player={player} />
        </Box>
      </Grid>
    </Grid>
  )
}

export default HomePage

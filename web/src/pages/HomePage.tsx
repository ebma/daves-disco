import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React from "react"
import PlayerArea from "../components/Player/PlayerArea"
import QueueArea from "../components/Queue/QueueArea"
import SearchArea from "../components/SearchArea/SearchArea"

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

function HomePage() {
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
          <QueueArea />
        </Box>
      </Grid>
      <Grid item xs={12} lg={5}>
        <Box className={classes.paper}>
          <PlayerArea />
        </Box>
      </Grid>
    </Grid>
  )
}

export default HomePage

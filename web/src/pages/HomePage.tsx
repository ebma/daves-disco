import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React from "react"
import QueueArea from "../components/Queue/QueueArea"
import PlayerArea from "../components/Player/PlayerArea"
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
        <Paper className={classes.paper}>
          <SearchArea style={{ marginBottom: 16 }} />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper className={classes.paper}>
          <PlayerArea />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper className={fixedHeightPaper}>
          <QueueArea />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default HomePage

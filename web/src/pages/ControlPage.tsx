import React from "react"
import Avatar from "@material-ui/core/Avatar"
import CssBaseline from "@material-ui/core/CssBaseline"
import Grid from "@material-ui/core/Grid"
import Headset from "@material-ui/icons/Headset"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Container from "@material-ui/core/Container"
import ControlsContainer from "../components/ControlsContainer"
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}))

const useHeaderStyles = makeStyles(theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}))

const Header = () => {
  const classes = useHeaderStyles()

  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={5} style={{ margin: "auto" }}>
      <Grid item>
        <Avatar className={classes.avatar}>
          <Headset />
        </Avatar>
      </Grid>
      <Grid item>
        <Typography variant="h2" align="center" color="primary">
          Discord Music Bot
        </Typography>
      </Grid>
      <Grid item>
        <Avatar className={classes.avatar}>
          <Headset />
        </Avatar>
      </Grid>
    </Grid>
  )
}

function ControlPage() {
  const classes = useStyles()

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper className={classes.paper}>
        <Header />
        <ControlsContainer />
      </Paper>
    </Container>
  )
}

export default ControlPage

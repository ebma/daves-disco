import React from "react"
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Headset from "@material-ui/icons/Headset"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"

const useHeaderStyles = makeStyles(theme => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  }
}))

function Header() {
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

export default Header

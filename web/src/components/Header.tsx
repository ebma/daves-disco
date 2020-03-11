import React from "react"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"

const useHeaderStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(3)
  }
}))

function Header() {
  const classes = useHeaderStyles()

  return (
    <Box >
      <Typography className={classes.typography} variant="h2" align="center" color="secondary">
        Discord Music Bot
      </Typography>
    </Box>
  )
}

export default Header

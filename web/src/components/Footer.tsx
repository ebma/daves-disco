import React from "react"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@mui/styles"
import Link from "@mui/material/Link"
import Container from "@mui/material/Container"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="http://www.marcel-ebert.de">
        Marcel Ebert
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}

const useStyles = makeStyles(theme => ({
  footer: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2)
  }
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <Container maxWidth="sm">
        <Copyright />
      </Container>
    </footer>
  )
}

import Box from "@material-ui/core/Box"
import Divider from "@material-ui/core/Divider"
import Link from "@material-ui/core/Link"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import React from "react"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16
  },
  contentContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginTop: 8,

    [theme.breakpoints.up("md")]: {
      minWidth: 800
    }
  },
  typography: {
    paddingTop: 16,
    paddingBottom: 16
  },
  link: {
    fontSize: 32,

    [theme.breakpoints.down("sm")]: {
      fontSize: 16
    }
  }
}))

function InvitationArea() {
  const classes = useStyles()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Box className={classes.container}>
      <Typography align="center" variant="h4" color="textPrimary">
        Not yet a member of a Disco Server?
      </Typography>
      <Box className={classes.contentContainer} flexDirection={isSmallScreen ? "column" : "row"}>
        <Typography className={classes.typography} color="textSecondary" align="center">
          Listen to sessions at
          <br />
          <Link className={classes.link} href="https://discord.gg/SCMfSwD" target="_blank">
            Daves Disco Playground
          </Link>
        </Typography>
        {isSmallScreen ? (
          <Typography align="center" variant="h6">
            OR
          </Typography>
        ) : (
          <Divider flexItem orientation="vertical" />
        )}
        <Typography className={classes.typography} color="textSecondary" align="center">
          Invite Dave to play sessions at your
          <br />
          <Link
            className={classes.link}
            href="https://discord.com/api/oauth2/authorize?client_id=616271106399141889&permissions=36924480&scope=bot"
            target="_blank"
          >
            Own Server
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default InvitationArea

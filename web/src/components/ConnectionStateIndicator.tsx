import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Typography, Box, Card } from "@material-ui/core"
import { SocketContext } from "../context/socket"

const useStyles = makeStyles(theme => ({
  cardStyle: {
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 8,
    marginBottom: 8
  },
  stateBox: {
    textAlign: "center"
  }
}))

function ConnectionStateIndicator(props: {}) {
  const classes = useStyles()
  const { connectionState } = React.useContext(SocketContext)

  const [displayComponent, setDisplayComponent] = React.useState<JSX.Element>()

  const ConnectedStateBox = React.useMemo(
    () => (
      <Typography variant="h6" className={classes.stateBox} color="textPrimary">
        The bot is up and running.
      </Typography>
    ),
    [classes]
  )

  const DisconnectedStateBox = React.useMemo(
    () => (
      <Typography variant="h6" className={classes.stateBox} color="error">
        The bot is currently unavailable.
      </Typography>
    ),
    [classes]
  )

  const ReconnectingStateBox = React.useMemo(
    () => (
      <Typography variant="h6" className={classes.stateBox} color="textSecondary">
        Trying to reconnect...
      </Typography>
    ),
    [classes]
  )

  React.useEffect(() => {
    switch (connectionState) {
      case "connected":
        setDisplayComponent(ConnectedStateBox)
        break
      case "disconnected":
        setDisplayComponent(DisconnectedStateBox)
        break
      case "reconnecting":
        setDisplayComponent(ReconnectingStateBox)
        break
    }
  }, [connectionState, ReconnectingStateBox, DisconnectedStateBox, ConnectedStateBox])

  return <Card className={classes.cardStyle}>{displayComponent}</Card>
}

export default ConnectionStateIndicator

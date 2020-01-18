import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { Link } from "@material-ui/core"
import { trackError } from "../../../shared/util/trackError"
import { SocketContext } from "../../../context/socket"

interface Props {}

function QueueArea(props: Props) {
  const { addListener, connectionState, guildID, sendControlMessage } = React.useContext(SocketContext)

  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    const unsubscribeCurrentQueue = addListener("currentQueue", setCurrentQueue)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentQueue")
        .then(setCurrentQueue)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentQueue()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  return (
    <Container style={{ marginTop: 16, marginBottom: 16 }}>
      <Grid container justify="space-between" onClick={toggleShow}>
        <Grid item>
          <Typography color="inherit" variant="h5">
            Queued songs
          </Typography>
        </Grid>
        <Grid item>
          {show ? <ExpandLessIcon style={{ fontSize: 32 }} /> : <ExpandMoreIcon style={{ fontSize: 32 }} />}
        </Grid>
      </Grid>

      {show ? (
        <List style={{ flexGrow: 1 }}>
          {currentQueue.map((track, index) => (
            <ListItem onClick={() => undefined} key={index}>
              <ListItemText
                primary={track.title}
                secondary={
                  <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
                    {track.url}
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        undefined
      )}
    </Container>
  )
}

export default React.memo(QueueArea)

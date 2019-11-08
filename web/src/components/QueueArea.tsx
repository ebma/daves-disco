import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { SocketContext } from "../context/socket"
import { Track } from "../../../src/typings/exported-types"
import { Link } from "@material-ui/core"

interface Props {
  tracks?: any[]
}

function QueueArea(props: Props) {
  const [show, setShow] = React.useState(true)
  const { addListener, guildID, sendControlMessage } = React.useContext(SocketContext)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  React.useEffect(() => {
    const unsubscribe = addListener("currentQueue", queue => {
      setCurrentQueue(queue)
    })

    if (guildID !== "") {
      sendControlMessage("getCurrentQueue").then(setCurrentQueue)
    }
    return unsubscribe
  }, [addListener, sendControlMessage, guildID, setCurrentQueue])

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
                  <Link href={track.url} color="inherit">
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

export default QueueArea

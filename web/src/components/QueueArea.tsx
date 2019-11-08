import React from "react"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import { Track } from "../../../src/typings/exported-types"
import { Link } from "@material-ui/core"

interface Props {
  currentQueue: Track[]
}

function QueueArea(props: Props) {
  const [show, setShow] = React.useState(true)

  const { currentQueue } = props

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

export default QueueArea

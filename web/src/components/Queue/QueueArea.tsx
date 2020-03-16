import React from "react"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Tooltip from "@material-ui/core/Tooltip"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import QueueList from "./QueueList"

const useStyles = makeStyles(theme => ({
  paper: {
    paddingTop: 8,
    padding: 16
  }
}))

interface Props {
  currentTrack?: Track
  currentQueue: Track[]
}

function QueueArea(props: Props) {
  const classes = useStyles()

  const { currentTrack, currentQueue } = props

  const [show, setShow] = React.useState(true)

  const toggleShow = React.useCallback(() => {
    setShow(!show)
  }, [show, setShow])

  const itemRow = React.useMemo(() => {
    const expandLessIcon = (
      <Tooltip arrow placement="top" title="Hide">
        <IconButton>
          <ExpandLessIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    const expandMoreIcon = (
      <Tooltip arrow placement="top" title="Show">
        <IconButton>
          <ExpandMoreIcon style={{ fontSize: 32 }} />
        </IconButton>
      </Tooltip>
    )

    return show ? expandLessIcon : expandMoreIcon
  }, [show])

  return (
    <Paper className={classes.paper}>
      <Grid container justify="space-between" onClick={toggleShow} alignItems="center">
        <Grid item>
          <Typography color="inherit" variant="h5">
            Queued songs
          </Typography>
        </Grid>
        <Grid item>{itemRow}</Grid>
      </Grid>
      {show ? <QueueList currentQueue={currentQueue} currentTrack={currentTrack} /> : undefined}
    </Paper>
  )
}

export default React.memo(QueueArea)

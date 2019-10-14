import React from "react"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { SocketContext } from "../context/socket"
import { Track } from "../../../src/types/exported-types"

const useSongCardStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
})

const CurrentSongCard = (props: { style?: React.CSSProperties }) => {
  const classes = useSongCardStyles()
  const { addListener, guildID, sendControlMessage } = React.useContext(SocketContext)
  const [currentSong, setCurrentSong] = React.useState<Track | undefined>(undefined)

  React.useEffect(() => {
    const unsubscribe = addListener("currentSong", setCurrentSong)
    if (guildID !== "") {
      sendControlMessage("getCurrentSong").then(setCurrentSong)
    }
    return unsubscribe
  }, [addListener, sendControlMessage, guildID])

  const cardActionArea = React.useMemo(() => {
    return currentSong ? (
      <CardActionArea onClick={() => window.open(currentSong.url, "_blank")}>
        <CardMedia
          className={classes.media}
          image={currentSong.thumbnail}
          title={`Thumbnail of ${currentSong.title}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {currentSong.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    ) : (
      <CardActionArea>
        <CardMedia className={classes.media} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            No song playing right now...
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            You can add one below.
          </Typography>
        </CardContent>
      </CardActionArea>
    )
  }, [currentSong, classes.media])

  const cardActions = React.useMemo(() => {
    return currentSong ? (
      <Button size="small" color="primary" onClick={() => window.open(currentSong.url, "_blank")}>
        Watch on Youtube
      </Button>
    ) : (
      <></>
    )
  }, [currentSong])

  return (
    <Card className={classes.card} style={props.style}>
      {cardActionArea}
      {/* <CardActions>{cardActions}</CardActions> */}
    </Card>
  )
}

export default CurrentSongCard

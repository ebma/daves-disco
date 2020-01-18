import React from "react"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import CardActions from "@material-ui/core/CardActions"

const useSongCardStyles = makeStyles({
  card: {
    maxWidth: 345
  },
  media: {
    height: 200,
    width: 400
  }
})

interface Props {
  currentSong?: Track
  style?: React.CSSProperties
}

const CurrentSongCard = (props: Props) => {
  const classes = useSongCardStyles()
  const { currentSong } = props

  return (
    <Card className={classes.card} style={props.style}>
      {currentSong ? (
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
        <CardActionArea onClick={() => window.open("https://http.cat/", "_blank")}>
          <CardMedia className={classes.media} image="https://http.cat/404.jpg" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              No song playing right now...
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              You can add one below.
            </Typography>
          </CardContent>
        </CardActionArea>
      )}
      <CardActions>
        {currentSong ? (
          <Button size="small" color="primary" onClick={() => window.open(currentSong.url, "_blank")}>
            Watch on Youtube
          </Button>
        ) : (
          <></>
        )}
      </CardActions>
    </Card>
  )
}

export default React.memo(CurrentSongCard)

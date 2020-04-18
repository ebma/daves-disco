import React from "react"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActionArea from "@material-ui/core/CardActionArea"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Typography from "@material-ui/core/Typography"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles"
import { SpotifyHelper } from "../../shared/utils/helpers"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"

const useSongCardStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      minHeight: "300px"
    },
    media: {}
  })
)

interface Props {
  style?: React.CSSProperties
}

const CurrentSongCard = (props: Props) => {
  const classes = useSongCardStyles()
  const { currentTrack } = useSelector((state: RootState) => state.player)

  return (
    <Card className={classes.card} elevation={10} style={props.style}>
      {currentTrack ? (
        <CardActionArea onClick={() => window.open(currentTrack.url, "_blank")}>
          <CardMedia
            className={classes.media}
            component="img"
            image={currentTrack.thumbnail?.large || currentTrack.thumbnail?.medium || currentTrack.thumbnail?.small}
            title={`Thumbnail of ${currentTrack.title}`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {SpotifyHelper.isSpotifyTrack(currentTrack)
                ? `${currentTrack.title} - ${currentTrack.artists}`
                : currentTrack.title}
            </Typography>
          </CardContent>
        </CardActionArea>
      ) : (
        <CardActionArea>
          <CardMedia
            className={classes.media}
            component="img"
            image="https://http.cat/404.jpg"
            title="No song playing"
          />
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
        {currentTrack ? (
          <Button size="small" color="primary" onClick={() => window.open(currentTrack.url, "_blank")}>
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

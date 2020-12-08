import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import Typography from "@material-ui/core/Typography"
import FavouriteIcon from "@material-ui/icons/Favorite"
import HistoryIcon from "@material-ui/icons/History"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import FavouritesTab from "./Tab/FavouritesTab"
import RecentHistoryTab from "./Tab/RecentHistoryTab"

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  headerContainer: {
    display: "flex",
    marginBottom: 16
  }
})

interface MusicCollectionAreaProps {}

function MusicCollectionArea(props: MusicCollectionAreaProps) {
  const classes = useStyles()

  const [showFavourites, setShowFavourites] = React.useState(false)

  const { favItems, recentItems } = useSelector((state: RootState) => state.cache)

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4" style={{ fontWeight: 500 }}>
          Browse
        </Typography>
        <Grid container alignItems="center" spacing={1} style={{ justifyContent: "flex-end" }}>
          <Grid item>
            <HistoryIcon color="primary" style={{ fontSize: "200%" }} />
          </Grid>
          <Grid item>
            <Switch
              checked={showFavourites}
              onChange={() => setShowFavourites(!showFavourites)}
              name="switchFavourites"
            />
          </Grid>
          <Grid item>
            <FavouriteIcon color="primary" style={{ fontSize: "200%" }} />
          </Grid>
        </Grid>
      </div>
      {showFavourites ? <FavouritesTab items={favItems} /> : <RecentHistoryTab items={recentItems} />}
    </div>
  )
}

export default React.memo(MusicCollectionArea)

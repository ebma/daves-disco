import Grid from "@material-ui/core/Grid"
import Switch from "@material-ui/core/Switch"
import Typography from "@material-ui/core/Typography"
import FavouriteIcon from "@material-ui/icons/Favorite"
import HistoryIcon from "@material-ui/icons/History"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useGetFavouritesQuery, useGetRecentsQuery } from "../../services/graphql/graphql"
import QueryWrapper from "../QueryWrapper/QueryWrapper"
import CollectionList from "./CollectionList"

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

interface MusicCollectionAreaProps {
  guildID: GuildID
}

function MusicCollectionArea(props: MusicCollectionAreaProps) {
  const classes = useStyles()

  const [showFavourites, setShowFavourites] = React.useState(false)

  const favouritesQuery = useGetFavouritesQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 3000,
    variables: { guild: props.guildID }
  })

  const recentsQuery = useGetRecentsQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 3000,
    variables: { guild: props.guildID }
  })

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h4" style={{ fontWeight: 500 }}>
          Browse
        </Typography>
        <Grid container alignItems="center" spacing={1} style={{ justifyContent: "flex-end" }}>
          <Grid item>
            <HistoryIcon color="action" style={{ fontSize: "200%" }} />
          </Grid>
          <Grid item>
            <Switch
              checked={showFavourites}
              onChange={() => setShowFavourites(!showFavourites)}
              name="switchFavourites"
            />
          </Grid>
          <Grid item>
            <FavouriteIcon color="action" style={{ fontSize: "200%" }} />
          </Grid>
        </Grid>
      </div>
      {showFavourites ? (
        <QueryWrapper loading={favouritesQuery.loading} error={favouritesQuery.error}>
          {favouritesQuery.data && favouritesQuery.data.playlistMany && favouritesQuery.data.trackMany ? (
            <CollectionList
              guildID={props.guildID}
              tracks={favouritesQuery.data.trackMany}
              playlists={favouritesQuery.data.playlistMany}
              sort="name"
            />
          ) : (
            <Typography>No favourites yet...</Typography>
          )}
        </QueryWrapper>
      ) : (
        <QueryWrapper loading={recentsQuery.loading} error={recentsQuery.error}>
          {recentsQuery.data && recentsQuery.data.trackRecents && recentsQuery.data.playlistRecents ? (
            <CollectionList
              guildID={props.guildID}
              tracks={recentsQuery.data.trackRecents}
              playlists={recentsQuery.data.playlistRecents}
              limit={20}
              sort="date"
            />
          ) : (
            <Typography>No recents yet...</Typography>
          )}
        </QueryWrapper>
      )}
    </div>
  )
}

export default React.memo(MusicCollectionArea)

import { makeStyles } from "@mui/styles"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import RefreshIcon from "@mui/icons-material/Cached"
import PlayIcon from "@mui/icons-material/PlayArrow"
import React from "react"
import { PlaylistFieldsFragment, TrackFieldsFragment, useGetTracksByIdsQuery } from "../../services/graphql/graphql"
import QueryWrapper from "../QueryWrapper/QueryWrapper"
import MixedItemList from "./MixedItemList"

const useStyles = makeStyles(theme => ({
  headerContainer: {
    justifyContent: "left",
    display: "flex",
    flexWrap: "wrap",

    [theme.breakpoints.down("xs")]: {
      justifyContent: "center"
    }
  },
  headerButton: {
    margin: 16,

    [theme.breakpoints.down("xs")]: {
      margin: 8,
      width: "70%"
    }
  },
  title: {
    alignSelf: "center",
    flexGrow: 1,
    textAlign: "center"
  }
}))

interface PlaylistHeaderProps {
  onBack?: () => void
  onEnqueueAll?: () => void
  onRefresh?: () => void
  title?: string
}

function PlaylistHeader(props: PlaylistHeaderProps) {
  const { onBack, onEnqueueAll, onRefresh, title } = props
  const classes = useStyles()

  return (
    <>
      <Box className={classes.headerContainer}>
        {onBack && (
          <Button
            className={classes.headerButton}
            variant="contained"
            color="secondary"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        )}
        {onEnqueueAll && (
          <Button
            className={classes.headerButton}
            color="secondary"
            onClick={onEnqueueAll}
            startIcon={<PlayIcon />}
            variant="contained"
          >
            Enqueue All
          </Button>
        )}
        {onRefresh && (
          <Button
            className={classes.headerButton}
            color="secondary"
            onClick={onRefresh}
            startIcon={<RefreshIcon />}
            variant="contained"
          >
            Refresh
          </Button>
        )}
        <Typography className={classes.title} variant="h5">
          {title}
        </Typography>
      </Box>

      <Divider variant="middle" />
    </>
  )
}

interface PlaylistListProps {
  guildID: GuildID
  playlist: PlaylistFieldsFragment
  onBack: () => void
  onEnqueueAll: (playlist: PlaylistFieldsFragment) => void
  onTrackSelect: (track: TrackFieldsFragment) => void
}

function PlaylistList(props: PlaylistListProps) {
  const { guildID, playlist, onBack, onEnqueueAll, onTrackSelect } = props

  const { loading, error, data } = useGetTracksByIdsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
    variables: { ids: playlist.tracks, limit: 200 }
  })

  const ItemList = React.useMemo(() => {
    return data ? (
      <MixedItemList guildID={guildID} tracks={data.trackByIds} onTrackSelect={onTrackSelect} />
    ) : (
      <Typography>No tracks found for playlist...</Typography>
    )
  }, [data, guildID, onTrackSelect])

  return (
    <>
      <PlaylistHeader onBack={onBack} onEnqueueAll={() => onEnqueueAll(playlist)} title={playlist.name} />
      <QueryWrapper loading={loading} error={error}>
        {ItemList}
      </QueryWrapper>
    </>
  )
}

export default React.memo(PlaylistList)

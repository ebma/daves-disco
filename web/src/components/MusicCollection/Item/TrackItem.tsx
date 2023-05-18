import Avatar from "@mui/material/Avatar"
import Link from "@mui/material/Link"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import RadioIcon from "@mui/icons-material/Radio"
import makeStyles from "@mui/styles/makeStyles"
import React, { useRef } from "react"
import { Draggable } from "react-beautiful-dnd"
import { TrackFieldsFragment } from "../../../services/graphql/graphql"
import { SpotifyHelper } from "../../../shared/utils/helpers"
import { DeleteButton, FavorButton, PlayButton } from "./Buttons"

const useStyles = makeStyles(theme => ({
  item: {
    borderRadius: 8,
    boxShadow: "1",
    display: "flex",
    padding: 0,
    position: "relative"
  },
  paper: {
    alignItems: "center",
    display: "flex",
    marginBottom: 8,
    marginTop: 8,
    width: "100%"
  },
  avatar: {}
}))

interface TrackItemProps {
  current?: boolean
  guildID: GuildID
  track: TrackFieldsFragment
  onClick?: () => void
  onDeleteClick?: () => void
  toggleFavourite?: (track: TrackFieldsFragment) => void
  showFavourite?: boolean
  thumbnailSize?: number
}

export const TrackItem = React.forwardRef(function TrackItem(props: TrackItemProps, ref: React.Ref<HTMLLIElement>) {
  const { current, guildID, track, onClick, onDeleteClick, toggleFavourite, showFavourite, thumbnailSize = 78 } = props
  const classes = useStyles()

  const primaryText = SpotifyHelper.isSpotifyTrack(track as Track) ? `${track.title} - ${track.artists}` : track.title

  return (
    <Paper className={classes.paper} elevation={0}>
      <ListItem className={classes.item} ref={ref} selected={current}>
        <ListItemAvatar>
          {track.source === "radio" ? (
            <RadioIcon
              className={classes.avatar}
              style={{ padding: 8, minWidth: thumbnailSize, minHeight: thumbnailSize }}
            />
          ) : (
            <Avatar
              alt="thumbnail"
              className={classes.avatar}
              src={track.thumbnail?.small || track.thumbnail?.medium || track.thumbnail?.large || undefined}
              style={{ minWidth: thumbnailSize, minHeight: thumbnailSize }}
              variant="rounded"
            />
          )}
        </ListItemAvatar>
        {onClick && <PlayButton onClick={onClick} style={{ marginLeft: 8 }} />}
        <ListItemText
          primaryTypographyProps={{
            style: {
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }
          }}
          secondaryTypographyProps={{
            style: {
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }
          }}
          primary={primaryText}
          secondary={
            track.url && (
              <Link href={track.url} color="inherit" target="_blank" rel="noreferrer">
                {track.url}
              </Link>
            )
          }
        />
        {onDeleteClick && <DeleteButton onClick={onDeleteClick} />}
        {showFavourite && (
          <FavorButton
            onClick={() => toggleFavourite && toggleFavourite(track)}
            favourite={track.favourite?.find(value => value && value.guild === guildID)?.favourite || false}
          />
        )}
      </ListItem>
    </Paper>
  )
})

interface DraggableTrackItemProps extends TrackItemProps {
  id: string
  index: number
  old?: boolean
}

export function DraggableTrackItem(props: DraggableTrackItemProps) {
  const { current, id, index } = props

  const myRef = useRef<HTMLLIElement>(null)
  React.useEffect(() => {
    if (current) {
      setTimeout(() => {
        myRef.current && myRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 500)
    }
  }, [current])

  return (
    <Draggable draggableId={id} key={id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <TrackItem {...props} ref={myRef} />
        </div>
      )}
    </Draggable>
  )
}

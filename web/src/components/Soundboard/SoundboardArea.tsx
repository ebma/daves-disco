import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import { makeStyles } from "@mui/styles"
import TextField from "@mui/material/TextField"
import CancelIcon from "@mui/icons-material/Cancel"
import React from "react"
import { AppDispatch, useAppDispatch } from "../../app/store";
import { playSound } from "../../redux/soundboardsSlice"
import { useGetSoundboardItemsQuery } from "../../services/graphql/graphql"
import { VolumeSlider } from "../Player/VolumeSlider"
import QueryWrapper from "../QueryWrapper/QueryWrapper"
import SoundboardItem from "./SoundboardItem"
import SoundboardItemFields from "./SoundboardItemFields"

function getVolumeFromLocalStorage() {
  return localStorage.getItem("volume") ? Number(localStorage.getItem("volume")) : 20
}

function saveVolumeToLocalStorage(volume: number) {
  localStorage.setItem("volume", String(volume))
}

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-evenly",
  },
  searchField: {
    margin: 16,
    minWidth: 400,

    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      marginTop: 8,
      marginBottom: 8,
    },
  },
  volumeSlider: {
    maxWidth: 500,
    minWidth: 400,
    margin: 16,

    [theme.breakpoints.down("sm")]: {
      minWidth: 200,
      marginTop: 8,
      marginBottom: 8,
    },
  },
}))

interface Props {
  guildID: GuildID
}

function SoundboardArea(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useAppDispatch()
  const soundboardItemsQuery = useGetSoundboardItemsQuery({
    fetchPolicy: "cache-and-network",
    pollInterval: 2000,
    variables: { guild: props.guildID, limit: 200 },
  })

  const [editableItemId, setEditableItemId] = React.useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [volume, setVolume] = React.useState(getVolumeFromLocalStorage)

  const play = React.useCallback(
    (item: SoundboardItemModel) => () => dispatch(playSound(item.source, volume)),
    [dispatch, volume]
  )

  const sortedItems = React.useMemo(() => {
    const items = soundboardItemsQuery.data ? soundboardItemsQuery.data.soundboardItemMany : []
    const matchingItems = items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchingItems.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [soundboardItemsQuery.data, searchTerm])

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <TextField
          className={classes.searchField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm("")}>
                  {searchTerm ? <CancelIcon fontSize="small" /> : undefined}
                </IconButton>
              </InputAdornment>
            ),
          }}
          label="Search"
          placeholder="..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <VolumeSlider
          className={classes.volumeSlider}
          volume={volume}
          onChange={(value) => {
            saveVolumeToLocalStorage(value)
            setVolume(value)
          }}
        />
      </div>
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        <QueryWrapper loading={soundboardItemsQuery.loading} error={soundboardItemsQuery.error}>
          {sortedItems.map((item) => {
            return item._id === editableItemId ? (
              <SoundboardItemFields
                editing
                item={item}
                guildID={props.guildID}
                onActionDone={() => setEditableItemId(undefined)}
              />
            ) : (
              <SoundboardItem
                key={item.name}
                item={item}
                onClick={play(item)}
                onEditClick={() => setEditableItemId(item._id)}
              />
            )
          })}
        </QueryWrapper>
      </Grid>
      <SoundboardItemFields guildID={props.guildID} />
    </div>
  )
}

export default SoundboardArea

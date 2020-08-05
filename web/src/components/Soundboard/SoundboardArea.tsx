import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import InputAdornment from "@material-ui/core/InputAdornment"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import CancelIcon from "@material-ui/icons/Cancel"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { playSound } from "../../redux/soundboardsSlice"
import { VolumeSlider } from "../Player/VolumeSlider"
import SoundboardItem from "./SoundboardItem"
import SoundboardItemFields from "./SoundboardItemFields"

function getVolumeFromLocalStorage() {
  return localStorage.getItem("volume") ? Number(localStorage.getItem("volume")) : 20
}

function saveVolumeToLocalStorage(volume: number) {
  localStorage.setItem("volume", String(volume))
}

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: "center",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  }
}))

function SoundboardArea() {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()
  const { items } = useSelector((state: RootState) => state.soundboard)

  const [editableItemId, setEditableItemId] = React.useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [volume, setVolume] = React.useState(getVolumeFromLocalStorage)

  const play = React.useCallback((item: SoundboardItemModel) => () => dispatch(playSound(item.source, volume)), [
    dispatch,
    volume
  ])

  const sortedItems = React.useMemo(() => {
    const matchingItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchingItems.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [items, searchTerm])

  const ItemList = React.useMemo(
    () =>
      sortedItems.map(item => {
        return item._id === editableItemId ? (
          <SoundboardItemFields editing item={item} onActionDone={() => setEditableItemId(undefined)} />
        ) : (
          <SoundboardItem
            key={item.name}
            item={item}
            onClick={play(item)}
            onEditClick={() => setEditableItemId(item._id)}
          />
        )
      }),
    [editableItemId, sortedItems, play]
  )

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "space-evenly"
        }}
      >
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm("")}>
                  {searchTerm ? <CancelIcon fontSize="small" /> : undefined}
                </IconButton>
              </InputAdornment>
            )
          }}
          label="Search"
          placeholder="..."
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          style={{ margin: 16, minWidth: 400 }}
        />
        <VolumeSlider
          volume={volume}
          onChange={value => {
            saveVolumeToLocalStorage(value)
            setVolume(value)
          }}
          style={{ maxWidth: 500, minWidth: 400, margin: 16 }}
        />
      </div>
      <Grid container spacing={3}>
        {ItemList}
      </Grid>
      <SoundboardItemFields />
    </div>
  )
}

export default SoundboardArea

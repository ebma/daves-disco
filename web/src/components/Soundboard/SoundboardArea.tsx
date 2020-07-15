import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { playSound } from "../../redux/soundboardsSlice"
import { VolumeSlider } from "../Player/VolumeSlider"
import SoundboardItemFields from "./SoundboardItemFields"
import SoundboardItem from "./SoundboardItem"

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

  const [volume, setVolume] = React.useState(20)
  const [editableItemId, setEditableItemId] = React.useState<string | undefined>(undefined)

  const play = React.useCallback((item: SoundboardItemModel) => () => dispatch(playSound(item.source, volume)), [
    dispatch,
    volume
  ])

  const sortedItems = React.useMemo(() => {
    return items.slice().sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

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
      <VolumeSlider volume={volume} onChange={setVolume} style={{ maxWidth: 500, minWidth: 400, marginBottom: 16 }} />
      <Grid container spacing={3}>
        {ItemList}
      </Grid>
      <SoundboardItemFields />
    </div>
  )
}

export default SoundboardArea

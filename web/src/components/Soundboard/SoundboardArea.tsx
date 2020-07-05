import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import AddNewItem from "./AddNewItem"
import SoundboardItem from "./SoundboardItem"
import { VolumeSlider } from "../Player/VolumeSlider"

import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { playSound } from "../../redux/soundboardsSlice"

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

  const [volume, setVolume] = React.useState(50)

  const play = React.useCallback((item: SoundboardItemModel) => () => dispatch(playSound(item.source, volume)), [
    dispatch,
    volume
  ])
  
  const ItemList = items.map(item => <SoundboardItem key={item.id} item={item} onClick={play(item)} />)

  console.log("items", items)

  return (
    <div className={classes.root}>
      <VolumeSlider volume={volume} onChange={setVolume} style={{ maxWidth: 500, minWidth: 400, marginBottom: 16 }} />
      <Grid container spacing={3}>
        {ItemList}
      </Grid>
      <AddNewItem />
    </div>
  )
}

export default SoundboardArea

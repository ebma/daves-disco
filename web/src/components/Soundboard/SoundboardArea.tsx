import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import AddNewItem from "./AddNewItem"
import SoundboardItem from "./SoundboardItem"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}))

function SoundboardArea() {
  const classes = useStyles()

  const { items } = useSelector((state: RootState) => state.soundboard)

  const ItemList = items.map(item => <SoundboardItem item={item} />)

  console.log("items", items)

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {ItemList}
      </Grid>
      <AddNewItem />
    </div>
  )
}

export default SoundboardArea

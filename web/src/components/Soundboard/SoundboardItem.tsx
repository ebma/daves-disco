import { Typography } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { playSound } from "../../redux/soundboardsSlice"

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex"
  },
  button: {
    color: theme.palette.text.secondary,
    textAlign: "center",
    width: "150px",
    height: "150px",
    borderRadius: "50%"
  }
}))

function SoundboardItem(props: { item: SoundboardItemModel }) {
  const { item } = props
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()

  const play = () => {
    dispatch(playSound(item.source))
  }

  return (
    <Grid className={classes.container} key={item.id} item>
      <Button className={classes.button} variant="outlined" onClick={play}>
        <Typography color="textPrimary" variant="body1">
          {item.name}
        </Typography>
      </Button>
    </Grid>
  )
}

export default SoundboardItem

import { Typography } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"

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

interface Props {
  item: SoundboardItemModel
  onClick: () => void
}

function SoundboardItem(props: Props) {
  const { item, onClick } = props
  const classes = useStyles()

  return (
    <Grid className={classes.container} item>
      <Button className={classes.button} variant="outlined" onClick={onClick}>
        <Typography color="textPrimary" variant="body1">
          {item.name}
        </Typography>
      </Button>
    </Grid>
  )
}

export default SoundboardItem

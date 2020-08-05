import Button from "@material-ui/core/Button"
import Fade from "@material-ui/core/Fade"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import EditIcon from "@material-ui/icons/Edit"
import React from "react"

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    position: "relative"
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
  onEditClick: () => void
}

function SoundboardItem(props: Props) {
  const { item, onClick, onEditClick } = props
  const classes = useStyles()

  const [showEditIcon, setShowEditIcon] = React.useState(false)

  return (
    <Grid
      className={classes.container}
      item
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
    >
      <Button className={classes.button} variant="outlined" onClick={onClick}>
        <Typography color="textPrimary" variant="body1">
          {item.name}
        </Typography>
      </Button>
      <div style={{ position: "absolute", top: -4, right: -4 }}>
        <Fade in={showEditIcon}>
          <IconButton onClick={onEditClick}>
            <EditIcon />
          </IconButton>
        </Fade>
      </div>
    </Grid>
  )
}

export default SoundboardItem

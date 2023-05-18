import Button from "@mui/material/Button"
import Fade from "@mui/material/Fade"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import { makeStyles } from "@mui/styles"
import Typography from "@mui/material/Typography"
import EditIcon from "@mui/icons-material/Edit"
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

import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { createItem } from "../../redux/soundboardsSlice"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "16px"
  },
  button: {
    alignSelf: "center",
    margin: theme.spacing(1),
    width: "fit-content"
  },
  textfield: {
    minWidth: 300
  }
}))

function AddNewItem() {
  const classes = useStyles()

  const [name, setName] = React.useState("")
  const [source, setSource] = React.useState("")

  const dispatch: AppDispatch = useDispatch()

  const createNewItem = () => {
    dispatch(createItem({ name, source }))
  }

  return (
    <div className={classes.root}>
      <TextField
        className={classes.textfield}
        label="Name"
        onChange={event => setName(event.target.value)}
        value={name}
      />
      <TextField
        className={classes.textfield}
        label="Source"
        onChange={event => setSource(event.target.value)}
        placeholder="https://path-to-my-sound.mp3"
        value={source}
      />
      <Button className={classes.button} onClick={createNewItem} variant="outlined">
        Add new
      </Button>
    </div>
  )
}

export default AddNewItem

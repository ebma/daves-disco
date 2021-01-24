import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import CancelIcon from "@material-ui/icons/Cancel"
import React from "react"
import {
  useCreateSoundboardItemMutation,
  useRemoveSoundboardItemByIdMutation,
  useUpdateSoundboardItemByIdMutation
} from "../../services/graphql/graphql"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    position: "relative"
  },
  button: {
    margin: theme.spacing(1),
    width: "fit-content"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center"
  },
  textfield: {
    minWidth: 300,

    [theme.breakpoints.down("sm")]: {
      minWidth: 200
    }
  }
}))

interface SoundboardItemFieldsProps {
  editing?: boolean
  guildID: GuildID
  item?: SoundboardItemModel
  onActionDone?: () => void
}

function SoundboardItemFields(props: SoundboardItemFieldsProps) {
  const { onActionDone } = props
  const classes = useStyles()

  const [name, setName] = React.useState(props.item?.name || "")
  const [source, setSource] = React.useState(props.item?.source || "")

  const [createItem] = useCreateSoundboardItemMutation({})
  const [updateItem] = useUpdateSoundboardItemByIdMutation({})
  const [removeItem] = useRemoveSoundboardItemByIdMutation({})

  const onCreate = React.useCallback(() => {
    createItem({ variables: { record: { name, source, guild: props.guildID } } })
  }, [createItem, name, source, props.guildID])

  const onUpdate = React.useCallback(() => {
    if (props.item) {
      updateItem({ variables: { id: props.item._id, record: { name, source } } })
      onActionDone && onActionDone()
    }
  }, [updateItem, props.item, name, source, onActionDone])

  const onDelete = React.useCallback(() => {
    if (props.item) {
      removeItem({ variables: { id: props.item._id } })
      onActionDone && onActionDone()
    }
  }, [removeItem, props.item, onActionDone])

  const Actions = React.useMemo(() => {
    return props.editing ? (
      <>
        <Button className={classes.button} onClick={onUpdate} variant="outlined">
          Update
        </Button>
        <Button className={classes.button} onClick={onDelete} variant="outlined">
          Delete
        </Button>
      </>
    ) : (
      <Button className={classes.button} onClick={onCreate} variant="outlined">
        Add new
      </Button>
    )
  }, [classes.button, onCreate, onDelete, onUpdate, props.editing])

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
      <div className={classes.buttonContainer}>{Actions}</div>
      {props.editing ? (
        <div style={{ position: "absolute", top: -4, right: -4 }}>
          <IconButton onClick={() => props.onActionDone && props.onActionDone()}>
            <CancelIcon />
          </IconButton>
        </div>
      ) : (
        undefined
      )}
    </div>
  )
}

export default SoundboardItemFields

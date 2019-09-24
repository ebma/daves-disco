import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { Typography, Box } from "@material-ui/core"
import { SocketContext } from "../context/socket"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    boxShadow: "4px 4px 2px 4px #888888"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}))

interface State {
  userID: string
  guildID: string
}

function UserIdentifierForm(props: {}) {
  const classes = useStyles()
  const socketContext = React.useContext(SocketContext)
  const [values, setValues] = React.useState<State>({
    userID: "240157227657330688",
    guildID: "401718954608951318"
  })
  
  React.useEffect(() => {
    socketContext.setGuildID(values.guildID)
    socketContext.setUserID(values.userID)
  }, [socketContext, values]) // The 'values' somehow break stuff
  
  const handleChange = (name: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value })
  }
  
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Typography variant="h6" color="textPrimary">
        Enter the IDs of Guild and User that should be used.
      </Typography>

      <Box display="flex">
        <TextField
          fullWidth
          className={classes.textField}
          id="guildid"
          label="Guild ID"
          placeholder="401718954608951318"
          value={values.guildID}
          onChange={handleChange("guildID")}
        />
        <TextField
          fullWidth
          className={classes.textField}
          id="userid"
          label="User ID"
          placeholder="240157227657330688"
          value={values.userID}
          onChange={handleChange("userID")}
        />
      </Box>
    </form>
  )
}

export default UserIdentifierForm

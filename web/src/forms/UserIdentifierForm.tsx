import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Typography, Box, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core"
import { SocketContext } from "../context/socket"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    boxShadow: "0 10px 20px #ccc; 2px 4px #888888"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

interface State {
  userID: string
  guildID: string
}

type Guilds = Array<{ id: string; name: string }>
type Members = Array<{ id: string; name: string }>

function UserIdentifierForm(props: {}) {
  const classes = useStyles()
  const socketContext = React.useContext(SocketContext)
  const [guilds, setGuilds] = React.useState<Guilds | null>(null)
  const [members, setMembers] = React.useState<Members | null>(null)

  const [values, setValues] = React.useState<State>({
    userID: "",
    guildID: ""
  })

  React.useEffect(() => {
    socketContext.sendControlMessage("getGuilds").then(setGuilds)
  }, [socketContext])

  React.useEffect(() => {
    if (values.guildID !== "") {
      socketContext.sendControlMessage("getUsers", { guildID: values.guildID }).then(setMembers)
    }
  }, [socketContext, values.guildID])

  // FIXME set user and guild id in socketcontext

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name as string]: event.target.value
    }))
  }

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Typography variant="h6" color="textPrimary">
        Choose the guild and member that fit.
      </Typography>

      <Box display="flex">
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="guildID">Guild</InputLabel>
          <Select
            value={values.guildID}
            onChange={handleChange}
            inputProps={{
              name: "guildID",
              id: "guildID"
            }}
          >
            {guilds ? guilds.map(guild => <MenuItem value={guild.id}>{guild.name}</MenuItem>) : undefined}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="userID">Member</InputLabel>
          <Select
            value={values.userID}
            onChange={handleChange}
            inputProps={{
              name: "userID",
              id: "userID"
            }}
          >
            {members ? members.map(member => <MenuItem value={member.id}>{member.name}</MenuItem>) : undefined}
          </Select>
        </FormControl>
      </Box>
    </form>
  )
}

export default UserIdentifierForm

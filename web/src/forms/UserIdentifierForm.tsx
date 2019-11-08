import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Typography, Box, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core"
import { Guilds, Members } from "../components/ControlsContainer"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    margin: theme.spacing(1)
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

interface Props {
  guilds: Guilds
  members?: Members
  setUserID: (userID: string) => void
  setGuildID: (guildID: string) => void
}

function UserIdentifierForm(props: Props) {
  const classes = useStyles()

  const { guilds, members, setUserID, setGuildID } = props

  const [values, setValues] = React.useState<State>({
    userID: "",
    guildID: ""
  })

  React.useEffect(() => {
    setUserID(values.userID)
    setGuildID(values.guildID)
  }, [values.userID, values.guildID, setUserID, setGuildID])

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
            {guilds
              ? guilds.map(guild => (
                  <MenuItem key={guild.id} value={guild.id}>
                    {guild.name}
                  </MenuItem>
                ))
              : undefined}
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
            {members
              ? members.map(member => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name}
                  </MenuItem>
                ))
              : undefined}
          </Select>
        </FormControl>
      </Box>
    </form>
  )
}

export default UserIdentifierForm

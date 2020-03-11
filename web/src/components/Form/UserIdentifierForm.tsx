import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Typography, Box, MenuItem, FormControl, InputLabel, Select } from "@material-ui/core"
import { Guilds, Members } from "../Controls/GuildSelection"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    margin: theme.spacing(1)
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

interface Props {
  currentGuild?: string
  currentUser?: string
  guilds: Guilds
  members?: Members
  setUserID: (userID: string) => void
  setGuildID: (guildID: string) => void
  onClick?: () => void
}

function UserIdentifierForm(props: Props) {
  const classes = useStyles()

  const { currentGuild, currentUser, guilds, members, setUserID, setGuildID } = props

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Typography variant="h6" color="textPrimary">
        Choose the guild and member that fit.
      </Typography>

      <Box display="flex">
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel htmlFor="guildID">Guild</InputLabel>
          <Select
            value={currentGuild}
            onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
              setGuildID(event.target.value as string)
            }}
            onClick={props.onClick}
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
            value={currentUser}
            onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
              setUserID(event.target.value as string)
            }}
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

export default React.memo(UserIdentifierForm)

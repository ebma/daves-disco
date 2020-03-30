import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  container: {
    padding: 16,
    margin: theme.spacing(1)
  },
  info: {
    paddingTop: 16
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
  authenticate: (guild: GuildID, user: UserID) => Promise<void>
  authenticated: boolean
  guildID?: GuildID
  userID?: UserID
  guilds: ReducedGuilds
  getMembers: (guildID: GuildID) => ReducedMembers
  setUserID: (userID: string) => void
  setGuildID: (guildID: string) => void
  onClick?: () => void
}

function UserIdentifierForm(props: Props) {
  const classes = useStyles()

  const { authenticate, authenticated, guildID, userID, guilds, getMembers, setUserID, setGuildID } = props

  const [authenticationError, setAuthenticationError] = React.useState<Error | null>(null)
  const [authenticationPending, setAuthenticationPending] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!authenticated && guildID && userID) {
      setAuthenticationPending(true)
      authenticate(guildID, userID)
        .catch(setAuthenticationError)
        .finally(() => setAuthenticationPending(false))
    }
  }, [authenticated, authenticate, guildID, userID])

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as "guildID" | "userID"
    const value = event.target.value as string

    if (name === "guildID") {
      setGuildID(value)
    } else if (name === "userID") {
      setUserID(value)
    }
  }

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Typography variant="h6" color="textPrimary">
        Choose the guild and member that fit.
      </Typography>

      <Box display="flex">
        <TextField
          className={classes.textField}
          helperText={guildID ? undefined : "Please select your guild/server"}
          fullWidth
          label="Guild"
          name="guildID"
          onChange={handleChange}
          select
          value={guildID || ""}
        >
          {guilds.map(guild => (
            <MenuItem key={guild.id} value={guild.id}>
              {guild.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.textField}
          helperText={userID ? undefined : "Please select yourself"}
          fullWidth
          name="userID"
          label="Member"
          onChange={handleChange}
          select
          value={userID || ""}
        >
          {guildID ? (
            getMembers(guildID).map(member => (
              <MenuItem key={member.id} value={member.id}>
                {member.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled value="None">
              None
            </MenuItem>
          )}
        </TextField>
      </Box>

      <Typography className={classes.info} color="textSecondary" align="center">
        {authenticationError ? (
          authenticationError.message
        ) : authenticationPending ? (
          "Authentication is pending. Check for a received message on your discord account."
        ) : (
          <>
            Not yet a member of the Server?
            <br />
            <Link href="https://discord.gg/Q2t6yFT" target="_blak">
              Join here!
            </Link>
          </>
        )}
      </Typography>
    </form>
  )
}

export default React.memo(UserIdentifierForm)

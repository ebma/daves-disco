import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { SocketContext } from "../../context/socket"
import { GuildContext } from "../../context/guild"
import loginService from "../../services/login"

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
  onClick?: () => void
}

function getTokenFromStorage() {
  return localStorage.getItem("auth-token")
}

function saveTokenToStorage(token: string) {
  localStorage.setItem("auth-token", token)
}

function UserIdentifierForm(props: Props) {
  const classes = useStyles()

  const { init, connectionState } = React.useContext(SocketContext)
  const { guilds, getMembers, guildID, userID, setUserID, setGuildID } = React.useContext(GuildContext)

  const [authenticationError, setAuthenticationError] = React.useState<Error | null>(null)
  const [authenticationPending, setAuthenticationPending] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string | null>(getTokenFromStorage)

  React.useEffect(() => {
    if (!token && guildID && userID) {
      setAuthenticationPending(true)
      loginService
        .login({ guildID, userID })
        .then(token => {
          setToken(token)
          saveTokenToStorage(token)
        })
        .catch(setAuthenticationError)
        .finally(() => setAuthenticationPending(false))
    }
  }, [guildID, userID, token])

  React.useEffect(() => {
    if (guildID && userID && connectionState === "disconnected" && token) {
      init(token).catch(setAuthenticationError)
    }
  }, [connectionState, init, guildID, userID, token])

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

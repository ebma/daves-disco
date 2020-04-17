import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import loginService from "../../services/login"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { initAuthenticationAction } from "../../redux/socketSlice"
import { AppDispatch } from "../../app/store"

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

  const dispatch: AppDispatch = useDispatch()
  const { connectionState, error } = useSelector((state: RootState) => state.socket)
  const { guilds } = useSelector((state: RootState) => state.guilds)
  const { user } = useSelector((state: RootState) => state.user)

  const [authenticationError, setAuthenticationError] = React.useState<string | null>(null)
  const [authenticationPending, setAuthenticationPending] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string | null>(getTokenFromStorage)

  const [selectedGuildID, setSelectedGuild] = React.useState<GuildID>(user?.guildID || "")
  const [selectedMember, setSelectedMember] = React.useState<UserID>(user?.id || "")

  React.useEffect(() => {
    setAuthenticationError(error)
  }, [error])

  React.useEffect(() => {
    if (!token && user) {
      setAuthenticationPending(true)
      loginService
        .login({ guildID: user.guildID, userID: user.id })
        .then(token => {
          setToken(token)
          saveTokenToStorage(token)
        })
        .catch(setAuthenticationError)
        .finally(() => setAuthenticationPending(false))
    }
  }, [user])

  React.useEffect(() => {
    if (connectionState === "disconnected" && user && token) {
      dispatch(initAuthenticationAction(token))
    }
  }, [connectionState, initAuthenticationAction, user, token])

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as "guildID" | "userID"
    const value = event.target.value as string

    if (name === "guildID") {
      setSelectedGuild(value)
    } else if (name === "userID") {
      setSelectedMember(value)
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
          helperText={selectedGuildID ? undefined : "Please select your guild/server"}
          fullWidth
          label="Guild"
          name="guildID"
          onChange={handleChange}
          select
          value={selectedGuildID}
        >
          {guilds.map(guild => (
            <MenuItem key={guild.id} value={guild.id}>
              {guild.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.textField}
          helperText={selectedMember ? undefined : "Please select yourself"}
          fullWidth
          name="userID"
          label="Member"
          onChange={handleChange}
          select
          value={selectedMember}
        >
          {selectedGuildID ? (
            guilds
              .find(guild => guild.id === selectedGuildID)
              ?.members.map(member => (
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
          authenticationError
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

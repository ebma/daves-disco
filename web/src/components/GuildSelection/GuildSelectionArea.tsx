import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Box from "@material-ui/core/Box"
import Link from "@material-ui/core/Link"
import MenuItem from "@material-ui/core/MenuItem"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import loginService from "../../services/login"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { initAuthenticationAction } from "../../redux/socketSlice"
import { AppDispatch } from "../../app/store"
import { fetchGuilds, Guild } from "../../redux/guildsSlice"
import { setUser, User } from "../../redux/userSlice"

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
    marginRight: theme.spacing(1),

    [theme.breakpoints.down("sm")]: {
      marginTop: 8,
      marginBottom: 8
    }
  },
  textFieldBox: {
    display: "flex",
    marginTop: 16,

    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap"
    }
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

function SelectBox(props: { guilds: Guild[]; user?: User }) {
  const { guilds, user } = props
  const classes = useStyles()
  const dispatch: AppDispatch = useDispatch()

  const [selectedGuildID, setSelectedGuild] = React.useState<GuildID>(user?.guildID || "")
  const [selectedMember, setSelectedMember] = React.useState<UserID>(user?.id || "")

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = event.target.name as "guildID" | "userID"
    const value = event.target.value as string

    if (name === "guildID") {
      setSelectedGuild(value)
    } else if (name === "userID") {
      setSelectedMember(value)

      const guildMember = guilds
        .find(guild => guild.id === selectedGuildID)
        ?.members.find(member => member.id === value)
      if (guildMember) {
        dispatch(setUser({ guildID: selectedGuildID, id: guildMember.id, name: guildMember.name }))
      }
    }
  }

  const GuildSelectItems = React.useMemo(() => {
    return guilds.map(guild => (
      <MenuItem key={guild.id} value={guild.id}>
        {guild.name}
      </MenuItem>
    ))
  }, [guilds])

  const UserSelectItems = React.useMemo(() => {
    if (selectedGuildID && guilds.find(guild => guild.id === selectedGuildID)) {
      return guilds
        .find(guild => guild.id === selectedGuildID)
        ?.members.map(member => (
          <MenuItem key={member.id} value={member.id}>
            {member.name}
          </MenuItem>
        ))
    } else {
      return (
        <MenuItem disabled value="None">
          None
        </MenuItem>
      )
    }
  }, [guilds, selectedGuildID])

  return (
    <Box className={classes.textFieldBox}>
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
        {GuildSelectItems}
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
        {UserSelectItems}
      </TextField>
    </Box>
  )
}

interface Props {
  onClick?: () => void
}

function getTokenFromStorage() {
  return localStorage.getItem("auth-token")
}

function saveTokenToStorage(token: string) {
  localStorage.setItem("auth-token", token)
}

function GuildSelectionArea(props: Props) {
  const classes = useStyles()

  const dispatch: AppDispatch = useDispatch()
  const { authError, connectionState } = useSelector((state: RootState) => state.socket)
  const { guilds } = useSelector((state: RootState) => state.guilds)
  const { user } = useSelector((state: RootState) => state.user)

  const [authenticationError, setAuthenticationError] = React.useState<string | null>(null)
  const [authenticationPending, setAuthenticationPending] = React.useState<boolean>(false)
  const [token, setToken] = React.useState<string | null>(getTokenFromStorage)

  const initLogin = React.useCallback(
    (user: User) => {
      setAuthenticationPending(true)
      loginService
        .login({ guildID: user.guildID, userID: user.id })
        .then(token => {
          setToken(token)
          saveTokenToStorage(token)
          dispatch(initAuthenticationAction(token))
        })
        .catch(setAuthenticationError)
        .finally(() => setAuthenticationPending(false))
    },
    [dispatch]
  )

  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchGuilds())
    }, 20000)
    dispatch(fetchGuilds())
    return () => clearInterval(interval)
  }, [dispatch])

  React.useEffect(() => {
    if (authError === "jwt-expired" && user) {
      initLogin(user)
    }
  }, [authError, initLogin, user])

  React.useEffect(() => {
    if (!token && user) {
      initLogin(user)
    }
  }, [initLogin, token, user])

  React.useEffect(() => {
    if (connectionState === "disconnected" && user && token) {
      dispatch(initAuthenticationAction(token))
    }
  }, [connectionState, dispatch, user, token])

  return (
    <Paper>
      <form className={classes.container} noValidate autoComplete="off">
        <Typography variant="h6" color="textPrimary">
          Choose the guild and member that fit.
        </Typography>

        {guilds.length > 0 ? (
          <SelectBox guilds={guilds} user={user || undefined} />
        ) : (
          <Typography align="center">No guilds online...</Typography>
        )}

        <Typography className={classes.info} color="textSecondary" align="center">
          {authenticationError ? (
            String(authenticationError)
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
    </Paper>
  )
}

export default React.memo(GuildSelectionArea)

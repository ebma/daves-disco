import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { AppDispatch } from "../../app/store"
import { trackError } from "../../context/notifications"
import { useTokenStorage } from "../../hooks/tokenStorage"
import { disconnectSocketAction, initAuthenticationAction } from "../../redux/socketSlice"
import { setUser, User } from "../../redux/userSlice"
import { Guild, useGetGuildsQuery } from "../../services/graphql/graphql"
import loginService from "../../services/login"
import QueryWrapper from "../QueryWrapper/QueryWrapper"

const useStyles = makeStyles(theme => ({
  button: {
    alignSelf: "center",
    marginTop: 24
  },
  container: {
    padding: 16,
    display: "flex",
    flexDirection: "column"
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

interface SelectBoxProps {
  guilds: Guild[]
  user?: User
}

function SelectBox(props: SelectBoxProps) {
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
      if (selectedGuildID !== value) {
        setSelectedMember("")
        dispatch(disconnectSocketAction())
      }
    } else if (name === "userID") {
      setSelectedMember(value)

      const guildMember = guilds
        .find(guild => guild.id === selectedGuildID)
        ?.members?.find(member => member.id === value)
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
        ?.members?.map(member => (
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

function GuildSelectionArea(props: Props) {
  const classes = useStyles()

  const tokenStorage = useTokenStorage()

  const dispatch: AppDispatch = useDispatch()
  const { authError, connectionState } = useSelector((state: RootState) => state.socket)

  const guildsQuery = useGetGuildsQuery({ pollInterval: 5000 })

  const { user } = useSelector((state: RootState) => state.user)

  const [authenticationPending, setAuthenticationPending] = React.useState<boolean>(false)

  const initLogin = React.useCallback(
    (user: User) => {
      setAuthenticationPending(true)
      loginService
        .login({ guildID: user.guildID, userID: user.id })
        .then(jwt => {
          const token = { user: user.id, guild: user.guildID, jwt }
          tokenStorage.saveToken(token)
          dispatch(initAuthenticationAction(token.jwt))
        })
        .catch(trackError)
        .finally(() => setAuthenticationPending(false))
    },
    [dispatch, tokenStorage]
  )

  const ActionButton = React.useMemo(() => {
    const onButtonClick = () => {
      if (!user) return

      if (authError === "jwt-expired") {
        initLogin(user)
      } else if (connectionState === "connected") {
        const token = tokenStorage.getTokenForUser(user.guildID, user.id)
        if (token) {
          dispatch(initAuthenticationAction(token.jwt))
        } else {
          initLogin(user)
        }
      }
    }

    const token = user ? tokenStorage.getTokenForUser(user.guildID, user.id) : null

    const text =
      connectionState === "authenticated"
        ? "Connected"
        : authError === "jwt-expired"
        ? "Reauthenticate"
        : token
        ? "Login"
        : "Authenticate"

    return (
      <Button
        className={classes.button}
        color="secondary"
        disabled={!user || connectionState === "authenticated" || authenticationPending}
        onClick={onButtonClick}
        variant="contained"
      >
        {text}
      </Button>
    )
  }, [authError, authenticationPending, classes.button, connectionState, dispatch, initLogin, tokenStorage, user])

  return (
    <Paper>
      <form className={classes.container} noValidate autoComplete="off">
        <Typography variant="h6" color="textPrimary">
          Choose the guild and member that fit.
        </Typography>

        <QueryWrapper loading={guildsQuery.loading} error={guildsQuery.error}>
          {guildsQuery.data && guildsQuery.data.getGuilds && guildsQuery.data.getGuilds.length > 0 ? (
            <SelectBox guilds={guildsQuery.data.getGuilds} user={user || undefined} />
          ) : (
            <Typography align="center">No guilds online...</Typography>
          )}
          {ActionButton}
        </QueryWrapper>

        <Typography className={classes.info} color="textSecondary" align="center">
          {authenticationPending
            ? "Authentication is pending. Check for a received message on your discord account."
            : authError === "jwt-expired"
            ? "Your login token expired. Please authenticate again."
            : undefined}
        </Typography>
      </form>
    </Paper>
  )
}

export default React.memo(GuildSelectionArea)

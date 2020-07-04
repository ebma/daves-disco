import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import AlbumIcon from "@material-ui/icons/Album"
import DashboardIcon from "@material-ui/icons/Dashboard"
import LoginIcon from "@material-ui/icons/LockOpen"
import SoundboardIcon from "@material-ui/icons/MusicNote"
import React from "react"
import { useHistory, useLocation } from "react-router"
import { makeStyles } from "@material-ui/core/styles"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"

const useStyles = makeStyles(theme => ({
  icon: {
    fontSize: "2rem"
  },
  item: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

export function MainListItems() {
  const history = useHistory()
  const location = useLocation()

  const classes = useStyles()

  const { connectionState } = useSelector((state: RootState) => state.socket)

  return (
    <div>
      <ListItem
        button
        className={classes.item}
        disabled={connectionState !== "authenticated"}
        selected={location.pathname.includes("/home")}
        onClick={() => history.push("/home")}
      >
        <ListItemIcon>
          <DashboardIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        className={classes.item}
        disabled={connectionState !== "authenticated"}
        selected={location.pathname.includes("/music")}
        onClick={() => history.push("/music")}
      >
        <ListItemIcon>
          <AlbumIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Music" />
      </ListItem>
      <ListItem
        button
        className={classes.item}
        disabled={connectionState !== "authenticated"}
        selected={location.pathname.includes("/soundboard")}
        onClick={() => history.push("/soundboard")}
      >
        <ListItemIcon>
          <SoundboardIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Soundboard" />
      </ListItem>
      <ListItem
        button
        className={classes.item}
        selected={location.pathname.includes("/login")}
        onClick={() => history.push("/login")}
      >
        <ListItemIcon>
          <LoginIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </ListItem>
    </div>
  )
}

import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { makeStyles } from "@mui/styles"
import DashboardIcon from "@mui/icons-material/Dashboard"
import LogoutIcon from "@mui/icons-material/ExitToApp"
import SoundboardIcon from "@mui/icons-material/MusicNote"
import React from "react"
import { useNavigate, useLocation } from "react-router"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1
  },
  icon: {
    fontSize: "2rem"
  },
  item: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  logoutItem: {
    marginTop: "auto",
    marginBottom: theme.spacing(2)
  }
}))

interface Props {
  onLogoutClick: () => void
}

export function MainListItems(props: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const classes = useStyles()

  return (
    <List className={classes.root}>
      <ListItem
        button
        className={classes.item}
        selected={location.pathname.includes("/home")}
        onClick={() => navigate("/home")}
      >
        <ListItemIcon>
          <DashboardIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem
        button
        className={classes.item}
        selected={location.pathname.includes("/soundboard")}
        onClick={() => navigate("/soundboard")}
      >
        <ListItemIcon>
          <SoundboardIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Soundboard" />
      </ListItem>
      <ListItem button className={classes.logoutItem} onClick={props.onLogoutClick}>
        <ListItemIcon>
          <LogoutIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Log out" />
      </ListItem>
    </List>
  )
}

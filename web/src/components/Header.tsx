import React from "react"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core/styles"
import BrightnessHighIcon from "@material-ui/icons/Brightness7"
import BrightnessLowIcon from "@material-ui/icons/Brightness5"
import { ColorSchemeContext } from "../context/colorScheme"
import { Tooltip } from "@material-ui/core"

const useHeaderStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(3),
    flexGrow: 1
  },
  button: {
    height: "fit-content",
    alignSelf: "center"
  },
  icon: {
    fontSize: "130%"
  }
}))

function Header() {
  const classes = useHeaderStyles()

  const { colorScheme, toggleColorScheme } = React.useContext(ColorSchemeContext)

  const ToggleSchemeButton = React.useMemo(
    () => (
      <Tooltip title="Toggle theme">
        <IconButton className={classes.button} color="secondary" onClick={toggleColorScheme}>
          {colorScheme === "dark" ? (
            <BrightnessHighIcon className={classes.icon} />
          ) : (
            <BrightnessLowIcon className={classes.icon} />
          )}
        </IconButton>
      </Tooltip>
    ),
    [classes, colorScheme, toggleColorScheme]
  )

  return (
    <Box display="flex" flexDirection="row">
      <Typography className={classes.typography} variant="h2" align="center" color="secondary">
        Discord Music Bot
      </Typography>

      {ToggleSchemeButton}
    </Box>
  )
}

export default Header

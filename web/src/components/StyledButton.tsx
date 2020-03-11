import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

interface Props {
  alignIconBefore?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon: JSX.Element
  style?: React.CSSProperties
  text: string
  onClick: () => void
}

function StyledButton(props: Props) {
  const classes = useStyles()

  const isSmallScreen = useMediaQuery("(max-width:1000px)")

  const { alignIconBefore, ...reducedProps } = props

  return (
    <Button {...reducedProps} color="secondary" className={classes.button} variant="contained">
      {alignIconBefore ? props.icon : undefined}
      {isSmallScreen ? undefined : props.text}
      {alignIconBefore ? undefined : props.icon}
    </Button>
  )
}

export default StyledButton

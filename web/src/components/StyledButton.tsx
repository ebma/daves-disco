import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

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
  text?: string
  onClick: () => void
}

function StyledButton(props: Props) {
  const classes = useStyles()

  const { alignIconBefore, ...reducedProps } = props

  return (
    <Button {...reducedProps} color="secondary" className={classes.button} variant="contained">
      {alignIconBefore ? props.icon : undefined}
      {props.text}
      {alignIconBefore ? undefined : props.icon}
    </Button>
  )
}

export default StyledButton

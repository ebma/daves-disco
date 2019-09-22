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
  fullWidth?: boolean
  icon: JSX.Element
  style?: React.CSSProperties
  text: string
  onClick: () => void
}

function StyledButton(props: Props) {
  const classes = useStyles()

  return (
    <Button
      fullWidth={props.fullWidth}
      variant="contained"
      color="secondary"
      className={classes.button}
      style={props.style}
    >
      {props.alignIconBefore ? props.icon : undefined}
      {props.text}
      {props.alignIconBefore ? undefined : props.icon}
    </Button>
  )
}

export default StyledButton

import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import PauseIcon from "@material-ui/icons/Pause"
import PlayIcon from "@material-ui/icons/PlayArrow"
import RepeatIcon from "@material-ui/icons/Repeat"
import RepeatOneIcon from "@material-ui/icons/RepeatOne"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { useDebounce } from "../../hooks/util"

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}))

interface StyledButtonProps {
  alignIconBefore?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon: JSX.Element
  style?: React.CSSProperties
  text?: string
  onClick: () => void
}

function StyledControlButton(props: StyledButtonProps) {
  const classes = useStyles()

  const { alignIconBefore, style, ...reducedProps } = props

  return (
    <Button {...reducedProps} color="primary" className={classes.button} style={{ borderRadius: 50, padding: 16, ...style }}>
      {alignIconBefore ? props.icon : undefined}
      {props.text}
      {alignIconBefore ? undefined : props.icon}
    </Button>
  )
}

interface DebouncedButtonProps {
  alignIconBefore?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon: JSX.Element
  style?: React.CSSProperties
  text: string
  onClick?: () => void
}

function DebouncedButton(props: DebouncedButtonProps) {
  const onButtonClick = useDebounce(() => props.onClick && props.onClick(), 300, {
    leading: true,
    trailing: false
  })

  return <StyledControlButton {...props} text={undefined} onClick={onButtonClick} />
}

interface ControlItemProps {
  disabled?: boolean
  onClick?: () => void
}

export function ShuffleButton(props: ControlItemProps) {
  return <DebouncedButton {...props} icon={<ShuffleIcon style={{ fontSize: "160%" }} />} text="Shuffle" />
}

export function LoopButton(props: ControlItemProps) {
  const { loopState } = useSelector((state: RootState) => state.player)
  const loopText = loopState === "none" ? "Don't repeat" : loopState === "repeat-one" ? "Repeat Track" : "Repeat"

  const loopIcon =
    loopState === "none" ? (
      <RepeatIcon color="disabled" />
    ) : loopState === "repeat-one" ? (
      <RepeatOneIcon style={{ fontSize: "160%" }} />
    ) : (
      <RepeatIcon style={{ fontSize: "160%" }} />
    )

  return <DebouncedButton {...props} icon={loopIcon} text={loopText} />
}

export function PlayButton(props: ControlItemProps) {
  return (
    <DebouncedButton
      {...props}
      icon={<PlayIcon style={{ fontSize: "200%" }} />}
      text="Play"
      style={{ padding: 24 }}
    />
  )
}

export function PauseButton(props: ControlItemProps) {
  return (
    <DebouncedButton
      {...props}
      icon={<PauseIcon style={{ fontSize: "200%" }} />}
      text="Pause"
      style={{ padding: 24 }}
    />
  )
}

export function SkipPreviousButton(props: ControlItemProps) {
  return (
    <DebouncedButton
      {...props}
      alignIconBefore
      icon={<SkipPreviousIcon style={{ fontSize: "160%" }} />}
      text="Skip previous"
    />
  )
}

export function SkipNextButton(props: ControlItemProps) {
  return <DebouncedButton {...props} icon={<SkipNextIcon style={{ fontSize: "160%" }} />} text="Skip next" />
}

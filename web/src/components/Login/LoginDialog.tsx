import { useTheme } from "@material-ui/core"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import Divider from "@material-ui/core/Divider"
import Slide from "@material-ui/core/Slide"
import { TransitionProps } from "@material-ui/core/transitions/transition"
import Typography from "@material-ui/core/Typography"
import useMediaQuery from "@material-ui/core/useMediaQuery"
import React from "react"
import GuildSelectionArea from "./GuildSelectionArea"
import InvitationArea from "./InvitationArea"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="right" ref={ref} {...props} />
})

interface Props {
  open: boolean
  onClose: () => void
}

function LoginDialog(props: Props) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <Dialog
      fullScreen={fullScreen}
      keepMounted
      maxWidth="xl"
      open={props.open}
      onClose={props.onClose}
      TransitionComponent={Transition}
    >
      <DialogContent>
        <Typography align="center" variant="h4">
          Login Panel
        </Typography>
        <GuildSelectionArea />
        <Divider orientation="horizontal" />
        <InvitationArea />
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog

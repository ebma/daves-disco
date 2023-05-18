import { useTheme } from "@mui/core"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import Divider from "@mui/material/Divider"
import Slide from "@mui/material/Slide"
import { TransitionProps } from "@mui/material/transitions/transition"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"
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

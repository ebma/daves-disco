import React from "react"
import { Container, Box } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import CurrentSongCard from "./CurrentSongCard"
import StyledButton from "./StyledButton"
import { SocketContext } from "../context/socket"
import VolumeSlider from "./VolumeSlider"
import UserIdentifierForm from "../forms/UserIdentifierForm"

interface ControlAreaProps {}

const ControlArea = (props: ControlAreaProps) => {
  const socketContext = React.useContext(SocketContext)
  const [isPlaying, setPlaying] = React.useState(false)

  const PlayButton = () => {
    return <StyledButton icon={<PlayIcon />} text="Play" onClick={() => undefined} />
  }

  const PauseButton = () => {
    return <StyledButton icon={<PauseIcon />} text="Pause" onClick={() => undefined} />
  }

  const SkipPreviousButton = () => {
    return <StyledButton alignIconBefore icon={<SkipPreviousIcon />} text="Skip previous" onClick={() => undefined} />
  }

  const SkipNextButton = () => {
    const onButtonClick = async () => {
      const response = await socketContext.sendCommand("skip")
      console.log("response", response)
    }
    return <StyledButton icon={<SkipNextIcon />} text="Skip next" onClick={onButtonClick} />
  }

  const GuildBox = () => {
    return (
      <Box marginX="16px" marginY="8px">
        <UserIdentifierForm />
      </Box>
    )
  }

  return (
    <Container>
      <GuildBox />
      <Grid container direction="row" alignItems="center" spacing={5} style={{ margin: "auto" }}>
        <Grid item>
          <CurrentSongCard style={{ alignSelf: "flex-start" }} />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <SkipPreviousButton />
            </Grid>
            <Grid item>{isPlaying ? <PauseButton /> : <PlayButton />}</Grid>
            <Grid item>
              <SkipNextButton />
            </Grid>
          </Grid>
          <VolumeSlider />
        </Grid>
      </Grid>
    </Container>
  )
}

export default ControlArea

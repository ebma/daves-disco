import React from "react"
import { Container, Box, Card } from "@material-ui/core"
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
import ConnectionStateIndicator from "./ConnectionStateIndicator"
import { trackError } from "../lib/trackError"
import { Track } from "../../../src/typings/exported-types"

interface ControlAreaProps {}

const ControlArea = (props: ControlAreaProps) => {
  const { addListener, connectionState, guildID, sendCommand, sendControlMessage } = React.useContext(SocketContext)
  const [isPlaying, setPlaying] = React.useState(true)
  const [volume, setVolume] = React.useState(50)
  const [currentSong, setCurrentSong] = React.useState<Track | undefined>(undefined)

  React.useEffect(() => {
    const unsubcribePause = addListener("paused", () => setPlaying(false))
    const unsubscribeResume = addListener("resumed", () => setPlaying(true))
    const unsubscribeVolume = addListener("volume", setVolume)
    const unsubscribeCurrentSong = addListener("currentSong", setCurrentSong)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentSong").then(setCurrentSong)
      sendControlMessage("getVolume").then(setVolume)
    }

    return () => {
      unsubcribePause()
      unsubscribeResume()
      unsubscribeVolume()
      unsubscribeCurrentSong()
    }
  }, [addListener, connectionState, sendControlMessage])

  const PlayButton = () => {
    const onButtonClick = async () => {
      sendCommand("resume")
        .then(() => setPlaying(true))
        .catch(trackError)
    }
    return <StyledButton icon={<PlayIcon />} text="Play" onClick={onButtonClick} />
  }

  const PauseButton = () => {
    const onButtonClick = async () => {
      sendCommand("pause")
        .then(() => setPlaying(false))
        .catch(trackError)
    }
    return <StyledButton icon={<PauseIcon />} text="Pause" onClick={onButtonClick} />
  }

  const SkipPreviousButton = () => {
    const onButtonClick = async () => {
      sendCommand("skip-previous").catch(trackError)
    }
    return <StyledButton alignIconBefore icon={<SkipPreviousIcon />} text="Skip previous" onClick={onButtonClick} />
  }

  const SkipNextButton = () => {
    const onButtonClick = async () => {
      sendCommand("skip").catch(trackError)
    }
    return <StyledButton icon={<SkipNextIcon />} text="Skip next" onClick={onButtonClick} />
  }

  const VolumeSliderContainer = () => {
    const onChange = (newVolume: number) => {
      sendCommand("volume", newVolume)
    }

    return <VolumeSlider volume={volume} onChange={onChange} />
  }

  const GuildSelectionBox = React.useMemo(() => {
    const StyledForm = (
      <Box style={{ marginTop: 8, marginBottom: 8 }}>
        <Card>
          <UserIdentifierForm />
        </Card>
      </Box>
    )
    return connectionState ? StyledForm : <></>
  }, [connectionState])

  return (
    <Container>
      <ConnectionStateIndicator />
      {GuildSelectionBox}
      <Grid container direction="row" alignItems="center" spacing={5} style={{ margin: "auto" }}>
        <Grid item>
          <CurrentSongCard currentSong={currentSong} style={{ alignSelf: "flex-start" }} />
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
          <VolumeSliderContainer />
        </Grid>
      </Grid>
    </Container>
  )
}

export default ControlArea

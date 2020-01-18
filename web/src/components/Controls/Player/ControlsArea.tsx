import React from "react"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import { useDebounce } from "../../../hooks/util"
import { SocketContext } from "../../../context/socket"
import StyledButton from "../../StyledButton"
import { trackError } from "../../../shared/util/trackError"
import CurrentSongCard from "./CurrentSongCard"
import VolumeSlider from "./VolumeSlider"

interface DebouncedButtonProps {
  alignIconBefore?: boolean
  icon: JSX.Element
  text: string
  onClick?: () => void
}

function DebouncedButton(props: DebouncedButtonProps) {
  const onButtonClick = useDebounce(() => props.onClick && props.onClick(), 300, { leading: true, trailing: false })

  return <StyledButton icon={props.icon} text={props.text} onClick={onButtonClick} />
}

interface ControlItemProps {
  onClick?: () => void
}

function PlayButton(props: ControlItemProps) {
  return <DebouncedButton icon={<PlayIcon />} text="Play" onClick={props.onClick} />
}

function PauseButton(props: ControlItemProps) {
  return <DebouncedButton icon={<PauseIcon />} text="Pause" onClick={props.onClick} />
}

function SkipPreviousButton(props: ControlItemProps) {
  return <DebouncedButton alignIconBefore icon={<SkipPreviousIcon />} text="Skip previous" onClick={props.onClick} />
}

function SkipNextButton(props: ControlItemProps) {
  return <DebouncedButton icon={<SkipNextIcon />} text="Skip next" onClick={props.onClick} />
}

interface Props {}

function ControlsArea(props: Props) {
  const { addListener, connectionState, guildID, sendCommand, sendControlMessage } = React.useContext(SocketContext)

  const [currentSong, setCurrentSong] = React.useState<Track | undefined>(undefined)
  const [isPlaying, setPlaying] = React.useState(true)
  const [volume, setVolume] = React.useState(50)

  React.useEffect(() => {
    const unsubscribeCurrentSong = addListener("currentSong", setCurrentSong)
    const unsubcribePause = addListener("paused", () => setPlaying(false))
    const unsubscribeResume = addListener("resumed", () => setPlaying(true))
    const unsubscribeVolume = addListener("volume", setVolume)

    if (connectionState === "connected" && guildID !== "") {
      sendControlMessage("getCurrentSong")
        .then(setCurrentSong)
        .catch(trackError)
      sendControlMessage("getVolume")
        .then(setVolume)
        .catch(trackError)
    }

    return () => {
      unsubscribeCurrentSong()
      unsubcribePause()
      unsubscribeResume()
      unsubscribeVolume()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  return (
    <Grid container direction="row" alignItems="center" spacing={5} style={{ margin: "auto" }}>
      <Grid item>
        <CurrentSongCard currentSong={currentSong} style={{ alignSelf: "flex-start" }} />
      </Grid>
      {currentSong ? (
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <SkipPreviousButton onClick={() => sendCommand("skip-previous").catch(trackError)} />
            </Grid>
            <Grid item>
              {isPlaying ? (
                <PauseButton onClick={() => sendCommand("pause").catch(trackError)} />
              ) : (
                <PlayButton onClick={() => sendCommand("resume").catch(trackError)} />
              )}
            </Grid>
            <Grid item>{<SkipNextButton onClick={() => sendCommand("skip").catch(trackError)} />}</Grid>
          </Grid>
          <VolumeSlider
            volume={volume}
            onChange={(newVolume: number) => {
              sendCommand("volume", newVolume)
            }}
          />
        </Grid>
      ) : (
        undefined
      )}
    </Grid>
  )
}

export default React.memo(ControlsArea)

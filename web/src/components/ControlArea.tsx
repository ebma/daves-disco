import React from "react"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import CurrentSongCard from "./CurrentSongCard"
import StyledButton from "./StyledButton"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import VolumeDown from "@material-ui/icons/VolumeDown"
import VolumeUp from "@material-ui/icons/VolumeUp"

const VolumeSlider = () => {
  const [value, setValue] = React.useState<number>(50)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  return (
    <div style={{ marginTop: 32, flexGrow: 1 }}>
      <Typography id="continuous-slider" align="center" color="primary" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider value={value} onChange={handleChange} valueLabelDisplay="auto" aria-labelledby="continuous-slider" />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  )
}

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
  return <StyledButton icon={<SkipNextIcon />} text="Skip next" onClick={() => undefined} />
}

interface ControlAreaProps {}

const ControlArea = (props: ControlAreaProps) => {
  const [isPlaying, setPlaying] = React.useState(false)

  return (
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
  )
}

export default ControlArea

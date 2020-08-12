import React from "react"
import Grid from "@material-ui/core/Grid"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import VolumeDown from "@material-ui/icons/VolumeDown"
import VolumeUp from "@material-ui/icons/VolumeUp"

interface VolumeSliderProps {
  className?: string
  volume: number
  onChange: (newVolume: number) => void
  style?: React.CSSProperties
}

export function VolumeSlider(props: VolumeSliderProps) {
  const { className, volume, onChange, style } = props

  const handleChange = (event: any, newValue: number | number[]) => {
    onChange(newValue as number)
  }

  return (
    <div className={className} style={{ ...style }}>
      <Typography id="continuous-slider" align="center" color="primary" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider aria-labelledby="continuous-slider" onChange={handleChange} value={volume} valueLabelDisplay="auto" />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  )
}

interface ControlledVolumeSliderProps extends VolumeSliderProps {
  disabled?: boolean
}

function ControlledVolumeSlider(props: ControlledVolumeSliderProps) {
  const { className, disabled, volume, onChange, style } = props

  const [privateValue, setValue] = React.useState<number>(50)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  React.useEffect(() => {
    setValue(Math.floor(volume))
  }, [volume])

  const handleChangeCommitted = (event: any, value: number | number[]) => onChange(value as number)

  return (
    <div className={className} style={{ ...style }}>
      <Typography id="continuous-slider" align="center" color="primary" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <VolumeDown />
        </Grid>
        <Grid item xs>
          <Slider
            aria-labelledby="continuous-slider"
            disabled={disabled}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            value={privateValue}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item>
          <VolumeUp />
        </Grid>
      </Grid>
    </div>
  )
}

export default React.memo(ControlledVolumeSlider)

import React from "react"
import Grid from "@material-ui/core/Grid"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import VolumeDown from "@material-ui/icons/VolumeDown"
import VolumeUp from "@material-ui/icons/VolumeUp"

interface Props {
  disabled?: boolean
  volume: number
  onChange: (newVolume: number) => void
}

function VolumeSlider(props: Props) {
  const { disabled, volume, onChange } = props

  const [privateValue, setValue] = React.useState<number>(50)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  React.useEffect(() => {
    setValue(Math.floor(volume))
  }, [volume])

  const handleChangeCommitted = (event: any, value: number | number[]) => onChange(value as number)

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

export default React.memo(VolumeSlider)

import React from "react"
import Typography from "@material-ui/core/Typography"
import Slider from "@material-ui/core/Slider"
import VolumeDown from "@material-ui/icons/VolumeDown"
import VolumeUp from "@material-ui/icons/VolumeUp"
import Grid from "@material-ui/core/Grid"

interface Props {
  volume: number
  onChange: (newVolume: number) => void
}

function VolumeSlider(props: Props) {
  const [privateValue, setValue] = React.useState<number>(50)

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number)
  }

  React.useEffect(() => {
    setValue(props.volume)
  }, [props.volume])

  const handleChangeCommitted = (event: any, value: number | number[]) => props.onChange(value as number)

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
            value={privateValue}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            valueLabelDisplay="auto"
            aria-labelledby="continuous-slider"
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

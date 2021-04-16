import { makeStyles } from "@material-ui/core/styles"
import ColorThief, { ColorArray } from "colorthief"
import React from "react"

const useStyles = makeStyles(theme => ({
  root: {
    width: "300vw",
    height: "100%",
    position: "fixed",
    overflow: "hidden"
  },
  wave: {
    position: "absolute",
    top: "60%",
    left: "-28%",
    width: "100%",
    height: "300vw",
    opacity: 1,
    transformOrigin: "50% 49%",
    borderRadius: "49%",
    background: "rgba(255, 255, 255, .75)",
    animation: "$wave 15s infinite linear",
    willChange: "transform"
  },
  "@keyframes wave": {
    "0%": {
      transform: "rotate(0deg)"
    },
    "100%": {
      transform: "rotate(360deg)"
    }
  }
}))

interface Props {
  avatarID: string
  currentTrack?: string
  waveCount?: number
}

function Waves(props: Props) {
  const classes = useStyles()

  const { waveCount = 3 } = props

  const [palette, setPalette] = React.useState<ColorArray | null>(null)

  React.useEffect(() => {
    const colorThief = new ColorThief()

    const getPalette = () => {
      if (!props.currentTrack) {
        return
      }
      const image = document.querySelector(`#${props.avatarID} img`)
      if (image) {
        try {
          const result = colorThief.getPalette(image, waveCount)
          setPalette(result)
        } catch (error) {
          console.error(error)
        }
      }
    }
    getPalette()

    const interval = setInterval(getPalette, 1000)
    return () => clearInterval(interval)
  }, [props.avatarID, props.currentTrack, waveCount])

  const WaveArray = React.useMemo(() => {
    return Array.from(Array(waveCount), (v, k) => (
      <div
        className={classes.wave}
        style={{
          background: palette ? `rgba(${palette[k][0]}, ${palette[k][1]}, ${palette[k][2]})` : undefined,
          animationDuration: `${10 + k * 2 + (k % 2) * 5}s`,
          left: `${-28 - 4 * k}%`
        }}
      />
    ))
  }, [classes.wave, palette, waveCount])

  return <div className={classes.root}>{WaveArray}</div>
}
export default React.memo(Waves)

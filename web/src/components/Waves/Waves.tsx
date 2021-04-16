import { makeStyles } from "@material-ui/core/styles"
import ColorThief, { Color, ColorArray } from "colorthief"
import React from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

const useStyles = makeStyles(theme => ({
  root: {
    width: "300vw",
    height: "100%",
    position: "fixed",
    overflow: "hidden"
  }
}))

function Wave(props: { color: Color; index?: number }) {
  const { index = 0 } = props

  const r = useSpring(255, {})
  const g = useSpring(255, {})
  const b = useSpring(255, {})

  const background = useMotionTemplate`rgba(${r}, ${g}, ${b}, 0.2)`

  React.useEffect(() => {
    r.set(props.color[0])
    g.set(props.color[1])
    b.set(props.color[2])
  }, [r, g, b, props.color])

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 10 + index * 2, ease: "easeInOut", loop: Infinity, repeatDelay: 0 }}
      style={{
        position: "absolute",
        top: "60%",
        width: "100%",
        height: "300vw",
        opacity: 1,
        transformOrigin: "50% 49%",
        borderRadius: "49%",
        background,
        left: `${-28 - 4 * index}%`
      }}
    />
  )
}

interface Props {
  avatarID: string
  currentTrack?: string
  waveCount?: number
}

function Waves(props: Props) {
  const classes = useStyles()

  const { waveCount = 3 } = props

  const [palette, setPalette] = React.useState<ColorArray | null>(null)
  const [color, setColor] = React.useState<Color | null>(null)

  const r = useSpring(255, {})
  const g = useSpring(255, {})
  const b = useSpring(255, {})
  const a = useSpring(0, {})

  const background = useMotionTemplate`rgba(${r}, ${g}, ${b}, ${a})`

  React.useEffect(() => {
    if (color) {
      r.set(color[0])
      g.set(color[1])
      b.set(color[2])
      a.set(0.2)
    } else {
      a.set(0)
    }
  }, [r, g, b, color])

  React.useEffect(() => {
    const colorThief = new ColorThief()

    const getPalette = () => {
      if (!props.currentTrack) {
        setPalette(null)
        setColor(null)
      } else {
        const image = document.querySelector(`#${props.avatarID} img`)
        if (image) {
          try {
            const resultPalette = colorThief.getPalette(image, waveCount)
            setPalette(resultPalette)
            const resultColor = colorThief.getColor(image)
            setColor(resultColor)
          } catch (error) {
            // ignore error that's thrown because the image is not loaded yet
            // console.error(error)
          }
        }
      }
    }
    getPalette()

    const interval = setInterval(getPalette, 1000) // use interval because html image has to load first
    return () => clearInterval(interval)
  }, [props.avatarID, props.currentTrack, waveCount])

  const WaveArray = React.useMemo(() => {
    return Array.from(Array(waveCount), (v, k) => <Wave color={palette ? palette[k] : [255, 255, 255]} index={k} />)
  }, [palette, waveCount])

  return (
    <motion.div className={classes.root} style={{ background }}>
      <motion.div
        className={classes.root}
        layout
        transition={{ duration: 2 }}
        style={{ top: props.currentTrack ? "0" : "100vh" }}
      >
        {WaveArray}
      </motion.div>
    </motion.div>
  )
}
export default React.memo(Waves)

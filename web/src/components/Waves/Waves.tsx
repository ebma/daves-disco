import { makeStyles } from "@mui/styles"
import ColorThief, { Color, ColorArray } from "colorthief"
import { motion, useMotionTemplate, useSpring } from "framer-motion"
import React from "react"
import { useGetTrackByIdLazyQuery } from "../../services/graphql/graphql"

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

function HiddenImageProxy(props: { src?: string; onLoad: (imageRef: HTMLImageElement) => void }) {
  const { onLoad: onLoadCallback } = props
  const ref = React.createRef<HTMLImageElement>()

  const onLoad = React.useCallback(() => {
    if (ref.current) {
      onLoadCallback(ref.current)
    }
  }, [ref, onLoadCallback])

  const proxySrc = React.useMemo(() => {
    if (props.src) {
      const googleProxyURL =
        "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url="

      return googleProxyURL + props.src // proxy needed because colorthief won't work without it
    } else {
      return undefined
    }
  }, [props.src])

  return (
    <img
      alt="hidden thumbnail for colorthief"
      crossOrigin="anonymous"
      src={proxySrc}
      ref={ref}
      onLoad={onLoad}
      style={{ display: "none" }}
    />
  )
}

interface Props {
  avatarID: string
  currentTrack?: TrackModelID
  waveCount?: number
}

function Waves(props: Props) {
  const { waveCount = 3 } = props

  const classes = useStyles()

  const [palette, setPalette] = React.useState<ColorArray | null>(null)
  const [color, setColor] = React.useState<Color | null>(null)

  const [loadTrack, trackQuery] = useGetTrackByIdLazyQuery({
    fetchPolicy: "cache-only",
    pollInterval: 3000
  })

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
  }, [a, r, g, b, color])

  React.useEffect(() => {
    if (props.currentTrack) {
      loadTrack({ variables: { id: props.currentTrack } })
    } else {
      setPalette(null)
      setColor(null)
    }
  }, [props.currentTrack, loadTrack])

  const loadPalette = React.useCallback(
    (image: HTMLImageElement) => {
      try {
        const colorThief = new ColorThief()
        const resultPalette = colorThief.getPalette(image, waveCount)
        const resultColor = colorThief.getColor(image)
        setPalette(resultPalette)
        setColor(resultColor)
      } catch (error) {
        console.error(error)
      }
    },
    [waveCount]
  )

  const WaveArray = React.useMemo(() => {
    return Array.from(Array(waveCount), (v, k) => <Wave color={palette ? palette[k] : [255, 255, 255]} index={k} />)
  }, [palette, waveCount])

  return (
    <motion.div className={classes.root} style={{ background }}>
      <HiddenImageProxy
        src={(props.currentTrack && trackQuery.data?.trackById?.thumbnail?.small) || undefined}
        onLoad={loadPalette}
      />
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

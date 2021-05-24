import { makeStyles } from "@material-ui/core"
import { motion } from "framer-motion"
import React from "react"

const useAlbumStyles = makeStyles({
  album: {
    boxShadow: "3px 3px 15px rgba(0, 0, 0, 0.65)",
    height: "315px",
    position: "relative",
    width: "315px",
    zIndex: 10
  },
  albumArt: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fff",
    height: "315px",
    position: "relative",
    width: "315px",
    zIndex: 10
  },
  vinylWrapper: {
    height: "300px",
    left: "0",
    position: "absolute",
    top: "5px",
    width: "300px",
    zIndex: 5
  },
  vinyl: {
    backgroundPosition: "center, center",
    backgroundSize: "cover, 40% auto",
    backgroundRepeat: "no-repeat",
    borderRadius: "100%",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
    height: "100%",
    width: "100%"
  }
})

function AlbumCover(props: { isPlaying: boolean; thumbnail?: string }) {
  const classes = useAlbumStyles()

  return (
    <div className={classes.album}>
      <div className={classes.albumArt} style={{ backgroundImage: `url("${props.thumbnail}")` }} />
      <motion.div
        className={classes.vinylWrapper}
        layout
        transition={{ duration: 1 }}
        style={{ left: props.isPlaying ? "52%" : undefined }}
      >
        <motion.div
          className={classes.vinyl}
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 2, repeat: Infinity }}
          style={{
            backgroundImage: `url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/83141/vinyl.png"), url("${props.thumbnail}")`
          }}
        />
      </motion.div>
    </div>
  )
}

export default AlbumCover

import CircularProgress from "@material-ui/core/CircularProgress"
import React from "react"

interface Props {
  height?: string | number
  style?: React.CSSProperties
}

function ViewLoading(props: Props) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: props.height || "100%",
        alignItems: "center",
        flexShrink: 0,
        justifyContent: "center",
        ...props.style
      }}
    >
      <CircularProgress disableShrink color="primary" />
    </div>
  )
}

export default ViewLoading

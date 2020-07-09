import React from "react"
import PlayIcon from "@material-ui/icons/PlayArrow"
import TextField from "@material-ui/core/TextField"
import StyledButton from "../../StyledButton"

interface PlayRadioTabProps {
  onSearchDone: (radio: Radio) => void
}

function PlayRadioTab(props: PlayRadioTabProps) {
  const { onSearchDone } = props
  const [name, setName] = React.useState("")
  const [source, setSource] = React.useState("")

  const onDone = React.useCallback(() => {
    if (name && source) {
      onSearchDone({ name, source })
    }
  }, [name, source, onSearchDone])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <TextField
        label="Radio Name"
        placeholder="My Favourite Radio"
        style={{ flexGrow: 5, marginRight: 8 }}
        value={name}
        variant="outlined"
        onChange={event => setName(event.target.value)}
      />
      <TextField
        label="URL of .mp3 stream"
        placeholder="http://stream.radio.de/stream/livestream.mp3"
        style={{ flexGrow: 5, marginLeft: 8, marginRight: 8 }}
        value={source}
        variant="outlined"
        onChange={event => setSource(event.target.value)}
        onKeyDown={event => {
          if (event.key === "Enter") {
            onDone()
          }
        }}
      />
      <StyledButton
        disabled={!Boolean(name) || !Boolean(source)}
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={onDone}
        style={{ flexGrow: 1 }}
      />
    </div>
  )
}

export default PlayRadioTab

import React from "react"
import PlayIcon from "@material-ui/icons/PlayArrow"
import TextField from "@material-ui/core/TextField"
import StyledButton from "../../StyledButton"
import { YoutubeHelper } from "../../../shared/utils/helpers"

interface PlayYoutubeTabProps {
  onSearchDone: (searchTerm: string) => void
}

function PlayYoutubeTab(props: PlayYoutubeTabProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<Error | undefined>(undefined)

  React.useEffect(() => {
    const isValidValue = () => {
      return YoutubeHelper.isYoutubeVideo(value) ? true : YoutubeHelper.describesYoutubePlaylist(value)
    }

    if (value && !isValidValue()) {
      setError(new Error("Invalid URL"))
    } else {
      setError(undefined)
    }
  }, [value])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <TextField
        error={Boolean(error)}
        label={error ? error.message : "Enter video or playlist URL"}
        placeholder="https://www.youtube.com/watch?v=..."
        style={{ flexGrow: 5 }}
        value={value}
        variant="outlined"
        onChange={event => setValue(event.target.value)}
        onKeyDown={event => {
          if (event.key === "Enter") {
            props.onSearchDone(value)
          }
        }}
      />
      <StyledButton
        disabled={!Boolean(value) || Boolean(error)}
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={() => props.onSearchDone(value)}
        style={{ flexGrow: 1 }}
      />
    </div>
  )
}

export default PlayYoutubeTab

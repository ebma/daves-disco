import React from "react"
import PlayIcon from "@material-ui/icons/PlayArrow"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import StyledButton from "../../StyledButton"
import { SpotifyHelper } from "../../../shared/utils/helpers"

interface PlaySpotifyTabProps {
  onSearchDone: (searchTerm: string) => void
}

function PlaySpotifyTab(props: PlaySpotifyTabProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<Error | undefined>(undefined)

  React.useEffect(() => {
    const isValidValue = () => {
      return SpotifyHelper.isSpotifyPlaylistURI(value)
    }

    if (value && !isValidValue()) {
      setError(new Error("Invalid URI"))
    } else {
      setError(undefined)
    }
  }, [value])

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <TextField
          error={Boolean(error)}
          label={error ? error.message : "Enter spotify playlist URI"}
          placeholder="spotify:playlist:asdfghjkl..."
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
      <Typography component="div" color="textSecondary" variant="caption" style={{ paddingTop: 8 }}>
        <b>Hint:</b> You can find the URI of your playlist by right-clicking it in the overview and selecting "Share" >
        "Copy Spotify URI".
      </Typography>
    </>
  )
}

export default PlaySpotifyTab

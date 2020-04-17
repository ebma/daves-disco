import React from "react"
import _ from "lodash"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import StyledButton from "../../StyledButton"
import { trackError } from "../../../context/notifications"

interface SearchYoutubeTabProps {
  getTracks: (term: string) => Promise<TrackSearchResult[]>
  onSearchDone: (searchTerm: string) => void
}

function SearchYoutubeTab(props: SearchYoutubeTabProps) {
  const { getTracks, onSearchDone } = props
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<TrackSearchResult[]>([])
  const [selectedTrack, setSelectedTrack] = React.useState<TrackSearchResult | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const fetch = React.useMemo(
    () =>
      _.debounce(
        async (input: string, callback: (results: TrackSearchResult[]) => void) => {
          const results = await getTracks(input)
          callback(results)
        },
        500,
        { leading: false, trailing: true }
      ),
    [getTracks]
  )

  React.useEffect(() => {
    if (inputValue === "") {
      setOptions([])
      return undefined
    }

    try {
      fetch(inputValue, (results: TrackSearchResult[]) => {
        setOptions(results || [])
      })
    } catch (error) {
      trackError(error)
    }
  }, [inputValue, fetch])

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      <Autocomplete
        style={{ flexGrow: 5, padding: 8, minWidth: "200px" }}
        getOptionLabel={option => option.title}
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        multiple={false}
        onChange={(_: React.ChangeEvent<{}>, value: TrackSearchResult | null) => setSelectedTrack(value)}
        renderInput={params => (
          <TextField
            {...params}
            fullWidth
            label="Search song"
            placeholder="bitch lasagna... ¯\_(ツ)_/¯"
            variant="outlined"
            onChange={handleChange}
          />
        )}
        renderOption={(option: TrackSearchResult) => {
          return (
            <Grid item xs>
              <Typography variant="body1" color="textPrimary">
                {option.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {option.url}
              </Typography>
            </Grid>
          )
        }}
      />
      <StyledButton
        disabled={!Boolean(selectedTrack)}
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={() => {
          if (selectedTrack && selectedTrack.url) {
            onSearchDone(selectedTrack.url)
          }
        }}
        style={{ flexGrow: 1 }}
      />
    </div>
  )
}

export default SearchYoutubeTab

import React from "react"
import _ from "lodash"
import Card from "@material-ui/core/Card"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Autocomplete from "@material-ui/lab/Autocomplete"
import makeStyles from "@material-ui/styles/makeStyles"
import { createTracksFromSearchTerm } from "../shared/util/youtube"
import StyledButton from "./StyledButton"
import { trackError } from "../shared/util/trackError"

const useStyles = makeStyles(theme => ({
  cardStyle: {
    display: "flex",
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: 8,
    marginBottom: 8
  }
}))

interface Props {
  onSearchDone: (searchTerm: string) => void
}

function AddSongArea(props: Props) {
  const classes = useStyles()

  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<Track[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const fetch = React.useMemo(
    () =>
      _.throttle(async (input: string, callback: (results: Track[]) => void) => {
        const results = await createTracksFromSearchTerm(input, 5)
        callback(results)
      }, 1000),
    []
  )

  React.useEffect(() => {
    if (inputValue === "") {
      setOptions([])
      return undefined
    }

    try {
      fetch(inputValue, (results: Track[]) => {
        setOptions(results || [])
      })
    } catch (error) {
      trackError(error)
    }
  }, [inputValue])

  return (
    <Card className={classes.cardStyle}>
      <Autocomplete
        style={{ flexGrow: 5, padding: 8 }}
        getOptionLabel={option => option.title}
        filterOptions={x => x}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        disableOpenOnFocus
        renderInput={params => (
          <TextField {...params} label="Search song" variant="outlined" fullWidth onChange={handleChange} />
        )}
        renderOption={(option: Track) => {
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
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={() => props.onSearchDone(inputValue)}
        style={{ flexGrow: 1 }}
      />
    </Card>
  )
}

export default AddSongArea

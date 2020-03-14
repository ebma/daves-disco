import React from "react"
import _ from "lodash"
import Autocomplete from "@material-ui/lab/Autocomplete"
import Box from "@material-ui/core/Box"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import PlayIcon from "@material-ui/icons/PlayArrow"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import { Theme, createStyles } from "@material-ui/core/styles"
import makeStyles from "@material-ui/styles/makeStyles"
import Youtube from "../../shared/util/Youtube"
import StyledButton from "../StyledButton"
import { SocketContext } from "../../context/socket"
import { trackError } from "../../context/notifications"
import Spotify from "../../shared/util/Spotify"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
  })
)

interface TabProps {
  onSearchDone: (searchTerm: string) => void
}

function SearchYoutubeTab(props: TabProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<Track[]>([])
  const [selectedTrack, setSelectedTrack] = React.useState<Track | null>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const fetch = React.useMemo(
    () =>
      _.throttle(async (input: string, callback: (results: Track[]) => void) => {
        const results = await Youtube.createTracksFromSearchTerm(input, 5)
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
        disableOpenOnFocus
        multiple={false}
        onChange={(_: React.ChangeEvent<{}>, value: Track | null) => setSelectedTrack(value)}
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
        disabled={!Boolean(selectedTrack)}
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={() => {
          if (selectedTrack && selectedTrack.url) {
            props.onSearchDone(selectedTrack.url)
          }
        }}
        style={{ flexGrow: 1 }}
      />
    </div>
  )
}

function PlayYoutubeTab(props: TabProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<Error | undefined>(undefined)

  React.useEffect(() => {
    const isValidValue = () => {
      return Youtube.isYoutubeVideo(value) ? true : Youtube.isYoutubePlaylist(value)
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

function PlaySpotifyTab(props: TabProps) {
  const [value, setValue] = React.useState("")
  const [error, setError] = React.useState<Error | undefined>(undefined)

  React.useEffect(() => {
    const isValidValue = () => {
      return Spotify.isSpotifyPlaylistURI(value)
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

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      {...other}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

interface EnqueueAreaProps {}

function SearchArea(props: EnqueueAreaProps) {
  const classes = useStyles()

  const { sendCommand } = React.useContext(SocketContext)
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  const onSearchDone = React.useCallback(searchTerm => sendCommand("play", searchTerm).catch(trackError), [sendCommand])

  return (
    <Paper className={classes.root}>
      <Tabs
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        variant="scrollable"
        draggable
        scrollButtons="auto"
        style={{ paddingLeft: 8, paddingRight: 8 }}
        value={value}
      >
        <Tab label="Search Youtube Song" />
        <Tab label="Play Youtube Video/Playlist" />
        <Tab label="Play Spotify Playlist" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SearchYoutubeTab onSearchDone={onSearchDone} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PlayYoutubeTab onSearchDone={onSearchDone} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PlaySpotifyTab onSearchDone={onSearchDone} />
      </TabPanel>
    </Paper>
  )
}

export default React.memo(SearchArea)
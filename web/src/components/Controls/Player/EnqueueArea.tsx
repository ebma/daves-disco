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
import makeStyles from "@material-ui/styles/makeStyles"
import Youtube from "../../../shared/util/Youtube"
import { trackError } from "../../../shared/util/trackError"
import StyledButton from "../../StyledButton"
import { SocketContext } from "../../../context/socket"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}))

interface TabProps {
  onSearchDone: (searchTerm: string) => void
}

function SearchYoutubeTab(props: TabProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<Track[]>([])

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
    <div style={{ display: "flex" }}>
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
          <TextField
            fullWidth
            label="Search song"
            placeholder="bitch lasagna"
            variant="outlined"
            onChange={handleChange}
            {...params}
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
        icon={<PlayIcon />}
        text="Enqueue"
        onClick={() => props.onSearchDone(inputValue)}
        style={{ flexGrow: 1 }}
      />
    </div>
  )
}

function PlayYoutubeTab(props: TabProps) {
  const [value, setValue] = React.useState("")

  return (
    <div style={{ display: "flex" }}>
      <TextField
        label="Enter video or playlist URL"
        placeholder="https://www.youtube.com/watch?v=..."
        style={{ flexGrow: 5 }}
        value={value}
        variant="outlined"
        onChange={event => setValue(event.target.value)}
      />
      <StyledButton
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

  return (
    <>
      <div style={{ display: "flex" }}>
        <TextField
          label="Enter spotify playlist URI"
          placeholder="spotify:playlist:asdfghjkl..."
          style={{ flexGrow: 5 }}
          value={value}
          variant="outlined"
          onChange={event => setValue(event.target.value)}
        />
        <StyledButton
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
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

interface EnqueueAreaProps {}

function EnqueueArea(props: EnqueueAreaProps) {
  const { sendCommand } = React.useContext(SocketContext)

  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  const onSearchDone = React.useCallback(searchTerm => sendCommand("play", searchTerm), [sendCommand])

  return (
    <Paper className={classes.root}>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
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

export default React.memo(EnqueueArea)

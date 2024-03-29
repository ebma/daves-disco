import Box from "@mui/material/Box"
import { createStyles } from "@mui/styles"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import Typography from "@mui/material/Typography"
import makeStyles from "@mui/styles/makeStyles"
import React from "react"
import { RootState } from "../../app/rootReducer"
import { AppDispatch, useAppDispatch, useAppSelector } from "../../app/store";
import { playSearchTerm, playRadio } from "../../redux/playerSlice"
import { getTrackFromSearchTerm } from "../../redux/tracksSlice"
import PlayRadioTab from "./Tab/PlayRadioTab"
import PlaySpotifyTab from "./Tab/PlaySpotifyTab"
import PlayYoutubeTab from "./Tab/PlayYoutubeTab"
import SearchYoutubeTab from "./Tab/SearchYoutubeTab"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},
  })
)

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

interface SearchAreaProps {
  style?: React.CSSProperties
}

function SearchArea(props: SearchAreaProps) {
  const { style } = props

  const dispatch: AppDispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.user)
  const classes = useStyles()

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  const onSearchDone = React.useCallback(
    async (searchTerm) => {
      if (user) {
        dispatch(playSearchTerm(searchTerm))
      }
    },
    [dispatch, user]
  )

  const onPlayRadio = React.useCallback(
    (radio: Radio) => {
      if (user) {
        dispatch(playRadio(radio))
      }
    },
    [dispatch, user]
  )

  const getTracks = React.useCallback((searchTerm: string) => {
    return getTrackFromSearchTerm(searchTerm)
  }, [])

  // use inputadornment at start of input field to select type of search

  return (
    <div className={classes.root} style={style}>
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
        <Tab label="Play Radio" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <SearchYoutubeTab onSearchDone={onSearchDone} getTracks={getTracks} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PlayYoutubeTab onSearchDone={onSearchDone} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <PlaySpotifyTab onSearchDone={onSearchDone} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PlayRadioTab onSearchDone={onPlayRadio} />
      </TabPanel>
    </div>
  )
}

export default React.memo(SearchArea)

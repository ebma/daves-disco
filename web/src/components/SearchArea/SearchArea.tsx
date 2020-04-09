import React from "react"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import { Theme, createStyles } from "@material-ui/core/styles"
import makeStyles from "@material-ui/styles/makeStyles"
import { SocketContext } from "../../context/socket"
import { trackError, NotificationsContext } from "../../context/notifications"
import { Messages } from "../../shared/ipc"
import SearchYoutubeTab from "./Tab/SearchYoutubeTab"
import PlayYoutubeTab from "./Tab/PlayYoutubeTab"
import PlaySpotifyTab from "./Tab/PlaySpotifyTab"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {}
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
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

interface SearchAreaProps {
  guildID: GuildID
  userID: UserID
  style?: React.CSSProperties
}

function SearchArea(props: SearchAreaProps) {
  const { guildID, userID, style } = props
  const classes = useStyles()

  const { sendMessage } = React.useContext(SocketContext)
  const { showNotification } = React.useContext(NotificationsContext)

  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  const onSearchDone = React.useCallback(
    async searchTerm => {
      sendMessage(Messages.Play, guildID, userID, searchTerm)
        .then(() => showNotification("success", "Successfully added track(s) to queue!"))
        .catch(trackError)
    },
    [guildID, userID, sendMessage, showNotification]
  )

  const getTrackFromSearchTerm = React.useCallback(
    (searchTerm: string) => {
      return sendMessage(Messages.GetTracksFromTerm, searchTerm)
    },
    [sendMessage]
  )

  return (
    <Paper className={classes.root} style={style}>
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
        <SearchYoutubeTab onSearchDone={onSearchDone} getTracks={getTrackFromSearchTerm} />
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

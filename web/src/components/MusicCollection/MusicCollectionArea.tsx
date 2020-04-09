import React from "react"
import Box from "@material-ui/core/Box"
import Paper from "@material-ui/core/Paper"
import makeStyles from "@material-ui/styles/makeStyles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import { Theme, createStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import { SocketContext } from "../../context/socket"
import { trackError } from "../../context/notifications"
import { Messages } from "../../shared/ipc"
import RecentHistoryTab from "./RecentHistoryTab"
import FavouritesTab from "./FavouritesTab"
import QueueTab from "./QueueTab"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    }
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
      {value === index && <Box>{children}</Box>}
    </Typography>
  )
}

interface MusicCollectionAreaProps {
  guildID: GuildID
  userID: UserID
}

function MusicCollectionArea(props: MusicCollectionAreaProps) {
  const { guildID, userID } = props
  const classes = useStyles()

  const { sendMessage } = React.useContext(SocketContext)

  const [tab, setTab] = React.useState(0)

  const handleChange = React.useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }, [])

  const enqueueTrack = React.useCallback(
    async track => {
      sendMessage(Messages.PlayTrack, guildID, userID, track).catch(trackError)
    },
    [guildID, userID, sendMessage]
  )

  const enqueuePlaylist = React.useCallback(
    async playlist => {
      sendMessage(Messages.PlayPlaylist, guildID, userID, playlist).catch(trackError)
    },
    [guildID, userID, sendMessage]
  )

  return (
    <Paper className={classes.root}>
      <Tabs
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        variant="fullWidth"
        scrollButtons="auto"
        style={{ paddingLeft: 8, paddingRight: 8 }}
        value={tab}
      >
        <Tab label="Queue" />
        <Tab label="Recent History" />
        <Tab label="Favourites" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <QueueTab guildID={guildID} enqueueTrack={enqueueTrack} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <RecentHistoryTab guildID={guildID} enqueueTrack={enqueueTrack} enqueuePlaylist={enqueuePlaylist} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <FavouritesTab guildID={guildID} enqueueTrack={enqueueTrack} enqueuePlaylist={enqueuePlaylist} />
      </TabPanel>
    </Paper>
  )
}

export default React.memo(MusicCollectionArea)

import Box from "@material-ui/core/Box"
import { createStyles, Theme } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/store"
import { fetchPlaylists, subscribePlaylists } from "../../redux/playlistsSlice"
import { fetchTracks, subscribeTracks } from "../../redux/tracksSlice"
import FavouritesTab from "./Tab/FavouritesTab"
import RecentHistoryTab from "./Tab/RecentHistoryTab"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    tabPanel: {
      height: "60vh",
      flexGrow: 1,
      overflow: "auto"
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
  const classes = useStyles()
  return (
    <Typography
      {...other}
      className={classes.tabPanel}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
    >
      <Box>{children}</Box>
    </Typography>
  )
}

interface MusicCollectionAreaProps {}

function MusicCollectionArea(props: MusicCollectionAreaProps) {
  const classes = useStyles()

  const [tab, setTab] = React.useState(0)

  const handleChange = React.useCallback((event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }, [])

  return (
    <div className={classes.root}>
      <Tabs
        indicatorColor="primary"
        onChange={handleChange}
        textColor="primary"
        variant="fullWidth"
        scrollButtons="auto"
        style={{ paddingLeft: 8, paddingRight: 8 }}
        value={tab}
      >
        <Tab label="Recent History" />
        <Tab label="Favourites" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <RecentHistoryTab />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <FavouritesTab />
      </TabPanel>
    </div>
  )
}

export default React.memo(MusicCollectionArea)

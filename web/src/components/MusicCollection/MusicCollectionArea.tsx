import Box from "@material-ui/core/Box"
import { createStyles, Theme } from "@material-ui/core/styles"
import Tab from "@material-ui/core/Tab"
import Tabs from "@material-ui/core/Tabs"
import Typography from "@material-ui/core/Typography"
import makeStyles from "@material-ui/styles/makeStyles"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
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
      flexGrow: 1
    },
    box: {
      height: "100%"
    },
    headerContainer: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    },
    headerTitle: {
      margin: 16,
      marginBottom: 0
    },
    tabs: {
      flexGrow: 1,
      height: "fit-content",
      paddingLeft: 8,
      paddingRight: 8,
      width: "100%"
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
      {value === index && <Box className={classes.box}>{children}</Box>}
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

  const { playlists } = useSelector((state: RootState) => state.playlists)
  const { tracks } = useSelector((state: RootState) => state.tracks)
  const { user } = useSelector((state: RootState) => state.user)
  const guildID = user?.guildID || ""

  const [recentItems, setRecentItems] = React.useState<MusicItem[]>([])
  const [favouriteItems, setFavouriteItems] = React.useState<MusicItem[]>([])

  React.useEffect(() => {
    const newItems = []
    newItems.push(...playlists)
    newItems.push(...tracks)

    const guildItems = newItems.filter(item => item.lastTouchedAt.find(value => value.guild === guildID && value.date))
    guildItems.sort((a: MusicItem, b: MusicItem) => {
      const dateA = new Date(Number(a.lastTouchedAt.find(value => value.guild === guildID)?.date || 0))
      const dateB = new Date(Number(b.lastTouchedAt.find(value => value.guild === guildID)?.date || 0))
      return dateB.getTime() - dateA.getTime()
    })

    const last20Items = guildItems.slice(0, 20)
    setRecentItems(last20Items)

    const favItems = newItems.filter(item => {
      return item.favourite.find(value => value.guild === guildID && value.favourite === true)
    })

    favItems.sort((a: any, b: any) => {
      const aIdentifier = a.title ? a.title : a.name
      const bIdentifier = b.title ? b.title : b.name

      return aIdentifier.localeCompare(bIdentifier)
    })

    setFavouriteItems(favItems)
  }, [guildID, playlists, tracks])

  return (
    <div className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant="h3" className={classes.headerTitle}>
          Collection
        </Typography>
        <Tabs
          className={classes.tabs}
          indicatorColor="primary"
          onChange={handleChange}
          textColor="primary"
          scrollButtons="auto"
          variant="fullWidth"
          value={tab}
        >
          <Tab label="Recent History" />
          <Tab label="Favourites" />
        </Tabs>
      </div>
      <TabPanel value={tab} index={0}>
        <RecentHistoryTab items={recentItems} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <FavouritesTab items={favouriteItems} />
      </TabPanel>
    </div>
  )
}

export default React.memo(MusicCollectionArea)

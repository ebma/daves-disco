import React from "react"
import { Container, Box, Card, Typography } from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import PlayIcon from "@material-ui/icons/PlayArrow"
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import PauseIcon from "@material-ui/icons/Pause"
import { SocketContext } from "../context/socket"
import UserIdentifierForm from "../forms/UserIdentifierForm"
import ConnectionStateIndicator from "./ConnectionStateIndicator"
import { trackError } from "../shared/util/trackError"
import AddSongArea from "./AddSongArea"
import CurrentSongCard from "./CurrentSongCard"
import QueueArea from "./QueueArea"
import VolumeSlider from "./VolumeSlider"
import StyledButton from "./StyledButton"

interface ControlAreaProps {}

export type Guilds = Array<{ id: string; name: string }>
export type Members = Array<{ id: string; name: string }>

function ControlsContainer(props: ControlAreaProps) {
  const {
    addListener,
    connectionState,
    guildID,
    userID,
    sendCommand,
    sendControlMessage,
    setUserID,
    setGuildID
  } = React.useContext(SocketContext)
  const [isPlaying, setPlaying] = React.useState(true)
  const [volume, setVolume] = React.useState(50)

  const [currentSong, setCurrentSong] = React.useState<Track | undefined>(undefined)
  const [currentQueue, setCurrentQueue] = React.useState<Track[]>([])

  const [guilds, setGuilds] = React.useState<Guilds | undefined>(undefined)
  const [members, setMembers] = React.useState<Members | undefined>(undefined)

  React.useEffect(() => {
    const unsubcribePause = addListener("paused", () => setPlaying(false))
    const unsubscribeResume = addListener("resumed", () => setPlaying(true))
    const unsubscribeVolume = addListener("volume", setVolume)
    const unsubscribeCurrentSong = addListener("currentSong", setCurrentSong)
    const unsubscribeCurrentQueue = addListener("currentQueue", setCurrentQueue)

    if (connectionState === "connected") {
      sendControlMessage("getGuilds").then(setGuilds)
      if (guildID !== "") {
        sendControlMessage("getUsers", { guildID }).then(setMembers)
        sendControlMessage("getCurrentSong").then(setCurrentSong)
        sendControlMessage("getVolume").then(setVolume)
        sendControlMessage("getCurrentQueue").then(setCurrentQueue)
      }
    }

    return () => {
      unsubcribePause()
      unsubscribeResume()
      unsubscribeVolume()
      unsubscribeCurrentSong()
      unsubscribeCurrentQueue()
    }
  }, [addListener, connectionState, guildID, sendControlMessage])

  const PlayButton = () => {
    const onButtonClick = async () => {
      sendCommand("resume")
        .then(() => setPlaying(true))
        .catch(trackError)
    }
    return <StyledButton icon={<PlayIcon />} text="Play" onClick={onButtonClick} />
  }

  const PauseButton = () => {
    const onButtonClick = async () => {
      sendCommand("pause")
        .then(() => setPlaying(false))
        .catch(trackError)
    }
    return <StyledButton icon={<PauseIcon />} text="Pause" onClick={onButtonClick} />
  }

  const SkipPreviousButton = () => {
    const onButtonClick = async () => {
      sendCommand("skip-previous").catch(trackError)
    }
    return <StyledButton alignIconBefore icon={<SkipPreviousIcon />} text="Skip previous" onClick={onButtonClick} />
  }

  const SkipNextButton = () => {
    const onButtonClick = async () => {
      sendCommand("skip").catch(trackError)
    }
    return <StyledButton icon={<SkipNextIcon />} text="Skip next" onClick={onButtonClick} />
  }

  const VolumeSliderContainer = () => {
    const onChange = (newVolume: number) => {
      sendCommand("volume", newVolume)
    }

    return <VolumeSlider volume={volume} onChange={onChange} />
  }

  const GuildSelectionBox = React.useMemo(() => {
    if (connectionState === "connected") {
      return (
        <Box style={{ marginTop: 8, marginBottom: 8 }}>
          <Card>
            {guilds ? (
              <UserIdentifierForm guilds={guilds} members={members} setUserID={setUserID} setGuildID={setGuildID} />
            ) : (
              <Typography variant="h6" color="textPrimary" align="center" style={{ padding: 8 }}>
                No guilds online...
              </Typography>
            )}
          </Card>
        </Box>
      )
    } else {
      return undefined
    }
  }, [connectionState, guilds, members, setUserID, setGuildID])

  const ControlArea = React.useMemo(
    () => (
      <Grid container direction="row" alignItems="center" spacing={5} style={{ margin: "auto" }}>
        <Grid item>
          <CurrentSongCard currentSong={currentSong} style={{ alignSelf: "flex-start" }} />
        </Grid>
        <Grid item>
          <Grid container direction="row">
            <Grid item>
              <SkipPreviousButton />
            </Grid>
            <Grid item>{isPlaying ? <PauseButton /> : <PlayButton />}</Grid>
            <Grid item>
              <SkipNextButton />
            </Grid>
          </Grid>
          <VolumeSliderContainer />
        </Grid>
      </Grid>
    ),
    [currentSong, isPlaying]
  )

  return (
    <Container>
      <ConnectionStateIndicator />
      {GuildSelectionBox}
      {connectionState === "connected" && userID ? (
        <>
          {ControlArea}
          <AddSongArea onSearchDone={searchTerm => sendCommand("play", searchTerm)} />
          <QueueArea currentQueue={currentQueue} />
        </>
      ) : (
        undefined
      )}
    </Container>
  )
}

export default ControlsContainer

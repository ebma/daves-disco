import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import { SocketContext } from "../../context/socket"
import UserIdentifierForm from "../Form/UserIdentifierForm"
import { trackError } from "../../context/notifications"

export type Guilds = Array<{ id: string; name: string }>
export type Members = Array<{ id: string; name: string }>

interface Props {}

function GuildSelectionCard(props: Props) {
  const { guildID, userID, sendControlMessage, setUserID, setGuildID } = React.useContext(SocketContext)

  const [guilds, setGuilds] = React.useState<Guilds | undefined>(undefined)
  const [members, setMembers] = React.useState<Members | undefined>(undefined)

  React.useEffect(() => {
    sendControlMessage("getGuilds")
      .then(setGuilds)
      .catch(trackError)

    if (guildID !== "") {
      sendControlMessage("getUsers", { guildID })
        .then(setMembers)
        .catch(trackError)
    }
  }, [guildID, sendControlMessage])

  return (
    <Card>
      {guilds ? (
        <UserIdentifierForm
          currentGuild={guildID}
          currentUser={userID}
          guilds={guilds}
          members={members}
          setUserID={setUserID}
          setGuildID={setGuildID}
        />
      ) : (
        <Typography variant="h6" color="textPrimary" align="center" style={{ padding: 8 }}>
          No guilds online...
        </Typography>
      )}
    </Card>
  )
}

export default React.memo(GuildSelectionCard)

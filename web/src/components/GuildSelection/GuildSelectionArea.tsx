import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import { SocketContext } from "../../context/socket"
import { trackError } from "../../context/notifications"
import UserIdentifierForm from "./UserIdentifierForm"
import { Messages } from "../../shared/ipc"

export type Guilds = Array<{ id: string; name: string }>
export type Members = Array<{ id: string; name: string }>

interface Props {}

function GuildSelectionArea(props: Props) {
  const { guildID, userID, sendMessage, setUserID, setGuildID } = React.useContext(SocketContext)

  const [guilds, setGuilds] = React.useState<Guilds | undefined>(undefined)
  const [members, setMembers] = React.useState<Members | undefined>(undefined)

  React.useEffect(() => {
    sendMessage(Messages.GetGuilds)
      .then(setGuilds)
      .catch(trackError)

    if (guildID !== "") {
      sendMessage(Messages.GetMembers, guildID)
        .then(setMembers)
        .catch(trackError)
    }
  }, [guildID, sendMessage])

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

export default React.memo(GuildSelectionArea)

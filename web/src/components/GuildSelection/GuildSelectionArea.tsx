import React from "react"
import Card from "@material-ui/core/Card"
import Typography from "@material-ui/core/Typography"
import { GuildContext } from "../../context/guild"
import { SocketContext } from "../../context/socket"
import UserIdentifierForm from "./UserIdentifierForm"

interface Props {}

function GuildSelectionArea(props: Props) {
  const { authenticated, authenticate } = React.useContext(SocketContext)
  const { guilds, getMembers, guildID, userID, setUserID, setGuildID } = React.useContext(GuildContext)

  return (
    <Card>
      {guilds ? (
        <UserIdentifierForm
          authenticated={authenticated}
          authenticate={authenticate}
          guildID={guildID}
          userID={userID}
          guilds={guilds}
          getMembers={getMembers}
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

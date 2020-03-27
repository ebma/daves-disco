import React from "react"
import { SocketContext } from "./socket"
import { Messages } from "../shared/ipc"

export interface GuildContextType {
  guilds: ReducedGuilds
  guildID: GuildID | undefined
  userID: UserID | undefined

  getMembers: (guildID: GuildID) => ReducedMembers
  isPlayerAvailable: (guildID: GuildID) => boolean
  setGuildID: (guildID: GuildID) => void
  setUserID: (userID: UserID) => void
}

export const GuildContext = React.createContext<GuildContextType>({
  guilds: [],
  guildID: undefined,
  userID: undefined,
  isPlayerAvailable: () => false,
  getMembers: () => [],
  setGuildID: () => undefined,
  setUserID: () => undefined
})

function getGuildIDFromLocalStorage() {
  const storedGuildID = localStorage.getItem("guildID")
  return storedGuildID ? storedGuildID : undefined
}

function getUserIDFromLocalStorage() {
  const storedUserID = localStorage.getItem("userID")
  return storedUserID ? storedUserID : undefined
}

interface Props {
  children: React.ReactNode
}

export function GuildProvider(props: Props) {
  const { connectionState, sendMessage } = React.useContext(SocketContext)
  const [guilds, setGuilds] = React.useState<ReducedGuilds>([])
  const [memberMap, setMemberMap] = React.useState<Record<string, ReducedMembers>>({})
  const [playerAvailableMap, setPlayerAvailableMap] = React.useState<Record<string, boolean>>({})

  const [guildID, setGuildID] = React.useState<GuildID | undefined>(getGuildIDFromLocalStorage)
  const [userID, setUserID] = React.useState<UserID | undefined>(getUserIDFromLocalStorage)

  const pollInfo = React.useCallback(async () => {
    if (connectionState !== "connected") return

    const guilds = await sendMessage(Messages.GetGuilds)
    setGuilds(guilds)

    for (const guild of guilds) {
      sendMessage(Messages.GetMembers, guild.id).then(members => {
        setMemberMap(prevState => {
          const copy = { ...prevState }
          copy[guild.id] = members
          return copy
        })
      })

      sendMessage(Messages.GetPlayerAvailable, guild.id).then(available => {
        setPlayerAvailableMap(prevState => {
          const copy = { ...prevState }
          copy[guild.id] = available
          return copy
        })
      })
    }
  }, [connectionState, sendMessage])

  React.useEffect(() => {
    pollInfo()
    const interval = setInterval(async () => {
      pollInfo()
    }, 10 * 1000)

    return () => clearInterval(interval)
  }, [pollInfo])

  const isPlayerAvailable = React.useCallback(
    (guildID: GuildID) => {
      return playerAvailableMap[guildID] || false
    },
    [playerAvailableMap]
  )

  const getMembers = React.useCallback(
    (guildID: GuildID) => {
      return memberMap[guildID] || []
    },
    [memberMap]
  )

  const contextValue: GuildContextType = {
    guilds,
    guildID,
    userID,
    isPlayerAvailable,
    getMembers,
    setGuildID: (guildID: GuildID) => {
      localStorage.setItem("guildID", guildID)
      setGuildID(guildID)
    },
    setUserID: (userID: UserID) => {
      localStorage.setItem("userID", userID)
      setUserID(userID)
    }
  }

  return <GuildContext.Provider value={contextValue}>{props.children}</GuildContext.Provider>
}

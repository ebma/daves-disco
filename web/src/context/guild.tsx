import React from "react"
import { SocketContext } from "./socket"
import { Messages } from "../shared/ipc"
import GuildService from "../services/guilds"
import { trackError } from "./notifications"

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
  const { sendMessage } = React.useContext(SocketContext)

  const [guilds, setGuilds] = React.useState<ReducedGuilds>([])
  const [guildID, setGuildID] = React.useState<GuildID | undefined>()
  const [memberMap, setMemberMap] = React.useState<Record<string, ReducedMembers>>({})
  const [userID, setUserID] = React.useState<UserID | undefined>()
  const [playerAvailableMap, setPlayerAvailableMap] = React.useState<Record<string, boolean>>({})

  const pollInfo = React.useCallback(async () => {
    try {
      const guilds = await GuildService.getGuilds()
      setGuilds(guilds)

      for (const guild of guilds) {
        GuildService.getMembers(guild.id).then(members => {
          setMemberMap(prevState => {
            if (prevState[guild.id] !== members) {
              const copy = { ...prevState }
              copy[guild.id] = members
              return copy
            } else {
              return prevState
            }
          })
        })

        sendMessage(Messages.GetPlayerAvailable, guild.id).then(available => {
          setPlayerAvailableMap(prevState => {
            if (prevState[guild.id] !== available) {
              const copy = { ...prevState }
              copy[guild.id] = available
              return copy
            } else {
              return prevState
            }
          })
        })
      }
    } catch (error) {
      trackError(error)
    }
  }, [sendMessage])

  React.useEffect(() => {
    pollInfo()
    const interval = setInterval(async () => {
      pollInfo()
    }, 10 * 1000)

    return () => clearInterval(interval)
  }, [pollInfo])

  React.useEffect(() => {
    let gID = guildID
    if (!gID) {
      const previousGuildID = getGuildIDFromLocalStorage()
      if (guilds.find(guild => guild.id === previousGuildID)) {
        gID = previousGuildID
        setGuildID(previousGuildID)
      }
    }

    if (gID) {
      const previousUserID = getUserIDFromLocalStorage()
      const members = memberMap[gID]
      if (members && members.find(member => member.id === previousUserID)) {
        if (!userID) {
          setUserID(previousUserID)
        }
      } else {
        setUserID(undefined)
      }
    }
  }, [guildID, userID, guilds, memberMap])

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

  const setAndSaveGuildID = React.useCallback((guildID: GuildID) => {
    localStorage.setItem("guildID", guildID)
    setGuildID(guildID)
  }, [])

  const setAndSaveUserID = React.useCallback((userID: UserID) => {
    localStorage.setItem("userID", userID)
    setUserID(userID)
  }, [])

  const contextValue: GuildContextType = {
    guilds,
    guildID,
    userID,
    isPlayerAvailable,
    getMembers,
    setGuildID: setAndSaveGuildID,
    setUserID: setAndSaveUserID
  }

  return <GuildContext.Provider value={contextValue}>{props.children}</GuildContext.Provider>
}

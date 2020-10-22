import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"
import { setTracks } from "./tracksSlice"
import { setPlaylists } from "./playlistsSlice"
import { setUser, User } from "./userSlice"

export interface CacheState {
  favItems: MusicItem[]
  recentItems: MusicItem[]
  guildID: GuildID | null
}

function getGuildIDFromLocalStorage() {
  const storedUser = localStorage.getItem("user")
  return storedUser ? (JSON.parse(storedUser) as User).guildID : null
}

const initialState: CacheState = {
  favItems: [],
  recentItems: [],
  guildID: getGuildIDFromLocalStorage()
}

function deriveItems(items: MusicItem[], guildID: GuildID) {
  const newItems = []
  newItems.push(...items)

  const guildItems = newItems.filter(item => item.lastTouchedAt.find(value => value.guild === guildID && value.date))
  guildItems.sort((a: MusicItem, b: MusicItem) => {
    const dateA = new Date(Number(a.lastTouchedAt.find(value => value.guild === guildID)?.date || 0))
    const dateB = new Date(Number(b.lastTouchedAt.find(value => value.guild === guildID)?.date || 0))
    return dateB.getTime() - dateA.getTime()
  })

  const favItems = newItems.filter(item => {
    return item.favourite.find(value => value.guild === guildID && value.favourite === true)
  })

  favItems.sort((a: any, b: any) => {
    const aIdentifier = a.title ? a.title : a.name
    const bIdentifier = b.title ? b.title : b.name

    return aIdentifier.localeCompare(bIdentifier)
  })

  const last20Items = guildItems.slice(0, 20)
  setRecentItems(last20Items)

  return [last20Items, favItems]
}

const cacheSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setFavItems(state, action: PayloadAction<MusicItem[]>) {
      state.favItems = action.payload
    },
    setRecentItems(state, action: PayloadAction<MusicItem[]>) {
      state.recentItems = action.payload
    },
    setGuildID(state, action: PayloadAction<GuildID>) {
      state.guildID = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(setTracks, (state, action) => {
      const tracks = action.payload
      const items = _.uniqBy(state.favItems.concat(state.recentItems).concat(tracks), "_id")
      if (state.guildID) {
        const [recentItems, favItems] = deriveItems(items, state.guildID)
        state.favItems = favItems
        state.recentItems = recentItems
      }
    })
    builder.addCase(setPlaylists, (state, action) => {
      const playlists = action.payload
      const items = _.uniqBy(state.favItems.concat(state.recentItems).concat(playlists), "_id")
      if (state.guildID) {
        const [recentItems, favItems] = deriveItems(items, state.guildID)
        state.favItems = favItems
        state.recentItems = recentItems
      }
    })
    builder.addCase(setUser, (state, action) => {
      const user = action.payload
      state.guildID = user.guildID
    })
  }
})

export const { setFavItems, setGuildID, setRecentItems } = cacheSlice.actions

export default cacheSlice.reducer

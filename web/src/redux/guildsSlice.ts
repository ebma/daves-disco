import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppThunk } from "../app/store"
import GuildService from "../services/guilds"

export interface Guild {
  id: GuildID
  name: string
  members: ReducedMembers
}

export interface GuildsState {
  error: string | null
  guilds: Guild[]
}

const initialState: GuildsState = {
  error: null,
  guilds: []
}

const guildsSlice = createSlice({
  name: "guilds",
  initialState,
  reducers: {
    getGuildsSuccess(state, action: PayloadAction<Guild[]>) {
      state.guilds = action.payload
      state.error = null
    },
    getGuildsFailed(state, action: PayloadAction<string>) {
      state.error = action.payload
    }
  }
})

export const { getGuildsSuccess, getGuildsFailed } = guildsSlice.actions

export default guildsSlice.reducer

export const fetchGuilds = (): AppThunk => async dispatch => {
  try {
    let guilds: Guild[] = []
    const reducedGuilds = await GuildService.getGuilds()

    for (const guild of reducedGuilds) {
      const reducedMembers = await GuildService.getMembers(guild.id)
      guilds.push({ id: guild.id, name: guild.name, members: reducedMembers })
    }
    dispatch(getGuildsSuccess(guilds))
  } catch (err) {
    dispatch(getGuildsFailed(err.toString()))
  }
}

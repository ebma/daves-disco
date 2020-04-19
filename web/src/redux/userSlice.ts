import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: UserID
  guildID: GuildID
  name: string
}

function getUserFromLocalStorage() {
  const storedUser = localStorage.getItem("user")
  return storedUser ? (JSON.parse(storedUser) as User) : null
}

function saveUserToLocalStorage(user: User) {
  localStorage.setItem("user", JSON.stringify(user))
}

export interface UserState {
  error: string | null
  user: User | null
}

const initialState: UserState = {
  error: null,
  user: getUserFromLocalStorage()
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      const user = action.payload
      state.user = user
      saveUserToLocalStorage(user)
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    }
  }
})

export const { setError, setUser } = userSlice.actions

export default userSlice.reducer

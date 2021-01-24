import { AppThunk } from "../app/store"
import { PlaylistFieldsFragment } from "../services/graphql/graphql"
import { Messages } from "../shared/ipc"
import { sendMessage } from "./socketSlice"

export const playPlaylist = (playlist: PlaylistFieldsFragment): AppThunk<Promise<void>> => async (
  dispatch,
  getState
) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayPlaylist, playlist as Playlist)).catch(error => {
      console.error(error)
    })
  }
}

import { AppThunk } from "../app/store"
import { TrackFieldsFragment } from "../services/graphql/graphql"
import youtubeService from "../services/youtube"
import { Messages } from "../shared/ipc"
import { sendMessage } from "./socketSlice"

export const playTrack = (track: TrackFieldsFragment): AppThunk<Promise<void>> => async (dispatch, getState) => {
  const { user } = getState().user
  if (user) {
    return dispatch(sendMessage(Messages.PlayTrack, track as Track)).catch(error => {
      console.error(error.message)
    })
  }
}

export const getTrackFromSearchTerm = (searchTerm: string) => {
  return youtubeService.findTracks(searchTerm)
}

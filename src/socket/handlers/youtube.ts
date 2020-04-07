import { Messages } from "../../shared/ipc"
import Youtube from "../../libs/Youtube"
import { WebSocketHandler } from "../WebSocketHandler"

const createGetTracksFromTermRequestHandler = () =>
  function handleGetTracksFromTermRequest(term: string) {
    const foundTracks = Youtube.createTracksFromSearchTerm(term, 5)

    return foundTracks
  }

export function initYoutubeHandlers(handler: WebSocketHandler) {
  handler.addHandler(Messages.GetTracksFromTerm, createGetTracksFromTermRequestHandler())
}

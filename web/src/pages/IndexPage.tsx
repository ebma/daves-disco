import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { HashRouter as Router } from "react-router-dom"
import { RootState } from "../app/rootReducer"
import { AppDispatch } from "../app/store"
import Dashboard from "../components/Dashboard/Dashboard"
import { fetchPlayerState, subscribePlayerState } from "../redux/playerSlice"

function IndexPage() {
  const dispatch: AppDispatch = useDispatch()
  const { connectionState } = useSelector((state: RootState) => state.socket)

  React.useEffect(() => {
    if (connectionState === "connected") {
      dispatch(fetchPlayerState())
    }

    const unsubscribe = dispatch(subscribePlayerState())

    return unsubscribe
  }, [connectionState, dispatch])

  return (
    <Router>
      <Dashboard />
    </Router>
  )
}

export default IndexPage

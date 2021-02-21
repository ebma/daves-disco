import { ApolloError } from "@apollo/client"
import Typography from "@material-ui/core/Typography"
import React from "react"
import ViewLoading from "./ViewLoading"

interface Props {
  children: React.ReactNode
  error?: ApolloError
  height?: number
  loading: boolean
}

function QueryWrapper(props: Props) {
  const { height, loading, error, children } = props

  return loading ? (
    <ViewLoading height={height} />
  ) : error ? (
    <Typography align="center" color="error" variant="h6">
      Error: {error.message}
    </Typography>
  ) : (
    <>{children}</>
  )
}

export default React.memo(QueryWrapper)

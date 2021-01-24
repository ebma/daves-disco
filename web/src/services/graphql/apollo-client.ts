import { ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network"
    }
  },
  uri: process.env.BOT_SERVER_PATH + "/graphql",
  cache: new InMemoryCache()
})

export default client

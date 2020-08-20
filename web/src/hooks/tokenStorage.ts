export interface Token {
  jwt: string
  guild: GuildID
  user: UserID
}

function getTokensFromStorage() {
  const tokensString = localStorage.getItem("auth-tokens")
  if (tokensString) {
    const tokens = JSON.parse(tokensString) as Token[]
    return tokens
  } else {
    return []
  }
}

export function useTokenStorage() {
  function getTokenForUser(guild: GuildID, user: UserID) {
    const tokens = getTokensFromStorage()
    const tokenForUser = tokens.find(token => token.guild === guild && token.user === user)
    return tokenForUser || null
  }

  function saveToken(token: Token) {
    const tokens = getTokensFromStorage()
    let tokensWithoutUser = tokens.filter(t => t.guild !== token.guild || t.user !== token.user)
    tokensWithoutUser.push(token)
    localStorage.setItem("auth-tokens", JSON.stringify(tokensWithoutUser))
  }

  return {
    getTokenForUser,
    saveToken
  }
}

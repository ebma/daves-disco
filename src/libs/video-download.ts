import ytdlDiscordWrapper from "discord-ytdl-core"
import Agent from "https-proxy-agent"
import _ from "lodash"

const proxies: string[] = [
  "https://185.28.193.95:8080",
  "https://192.240.46.126:80",
  "https://85.214.250.48:3128",
  "https://85.214.81.21:3128",
  "https://83.97.23.90:18080"
]

function selectRandomProxy(blacklist: string[] = []) {
  const filteredProxies = proxies.filter(proxy => !blacklist.includes(proxy))
  const proxyAddress = filteredProxies[_.random(filteredProxies.length - 1)]

  return proxyAddress
}

export function downloadVideoWithProxy(url: string, seek?: number) {
  let attempts = 0
  let triedProxies: string[] = []
  while (attempts < 3) {
    const proxyAddress = selectRandomProxy(triedProxies)
    try {
      console.log("proxyAddress", proxyAddress)
      const agent = Agent(proxyAddress)

      const stream = ytdlDiscordWrapper(url, {
        // encoderArgs: ["-af", "bass=g=5,dynaudnorm=f=200"],
        filter: "audioonly",
        highWaterMark: 1 << 25,
        opusEncoded: true,
        seek
      })
      return stream
    } catch (error) {
      console.error(error)
      triedProxies.push(proxyAddress)
    } finally {
      attempts++
    }
  }

  // return null if unsuccessful
  return null
}

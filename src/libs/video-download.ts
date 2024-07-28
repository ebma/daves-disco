import ytdl from "@distube/ytdl-core"
import  { HttpsProxyAgent } from "https-proxy-agent";
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
  const triedProxies: string[] = []
  while (attempts < 3) {
    const proxyAddress = selectRandomProxy(triedProxies)
    try {
      const agent = new HttpsProxyAgent(proxyAddress)

      const stream = ytdl (url, {
        filter: "audioonly",
        highWaterMark: 1 << 25,
        quality: "highestaudio",
        begin: seek
      })
      return stream
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error)
      triedProxies.push(proxyAddress)
    } finally {
      attempts++
    }
  }

  // return null if unsuccessful
  return null
}

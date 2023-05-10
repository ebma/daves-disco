import { ClientUser } from "discord.js"

class ActivityManager {
  private user: ClientUser | null

  constructor() {
    this.user = null
  }

  setUser(user: ClientUser) {
    this.user = user
  }

  setPlaying(content: string, url?: string) {
    if (this.user) {
      this.user.setPresence({ activities: [{ type: 2, name: content, url }], afk: false, status: "online" })
    }
  }

  setIdle() {
    if (this.user) {
      this.user.setPresence({ status: "idle" })
    }
  }
}

export default new ActivityManager()

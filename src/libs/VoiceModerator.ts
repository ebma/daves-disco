import _ from "lodash"
import MusicPlayer from "./MusicPlayer"

const song_starting: { [name: string]: string } = {
  "a-lot-of-new-music": "https://www.myinstants.com/media/sounds/a-lot-of-new-music.mp3",
  "are-you-ready": "https://www.myinstants.com/media/sounds/are-you-ready-2.mp3",
  "first-time-record": "https://www.myinstants.com/media/sounds/first-time-record.mp3",
  "lets-go": "https://www.myinstants.com/media/sounds/lets-go_kOKQu9q.mp3",
  "ready-for-a-trip": "https://www.myinstants.com/media/sounds/ready-for-a-trip.mp3",
  "this-is-my-remix": "https://www.myinstants.com/media/sounds/this-is-my-remix.mp3",
  "we-did-this-new-record": "https://www.myinstants.com/media/sounds/we-did-this-new-record.mp3",
  "shoutout-to-his-family": "https://www.myinstants.com/media/sounds/shoutout-to-his-family.mp3"
}
const song_ended: { [name: string]: string } = {
  "i-love-you": "https://www.myinstants.com/media/sounds/i-love-you_IO2ZNdu.mp3",
  "i-love-you-2": "https://www.myinstants.com/media/sounds/i-love-you-2.mp3"
}

const comment: { [name: string]: string } = {
  "can-you-feel-it": "https://www.myinstants.com/media/sounds/can-you-feel-it.mp3",
  "everybody-jump": "https://www.myinstants.com/media/sounds/everybody-jump.mp3",
  "giving-goosebumps": "https://www.myinstants.com/media/sounds/goosebumps.mp3",
  "incredible-day": "https://www.myinstants.com/media/sounds/such-an-incredible-day.mp3",
  "keep-raving": "https://www.myinstants.com/media/sounds/keep-raving.mp3",
  "having-a-good-time": "https://www.myinstants.com/media/sounds/good-time.mp3",
  "how-are-we-feeling": "https://www.myinstants.com/media/sounds/how-are-we-feeling.mp3",
  "my-name-is-dave": "https://www.myinstants.com/media/sounds/my-name-is_y2Uih5t.mp3",
  "let-me-see-your-hands": "https://www.myinstants.com/media/sounds/let-me-see-your-hands.mp3",
  "raise-your-fucking-hands": "https://www.myinstants.com/media/sounds/raise-your-fucking-hands.mp3",
  "raise-your-hands": "https://www.myinstants.com/media/sounds/people-at-home-raise-your-hands.mp3",
  "party-harder-hands-up": "https://www.myinstants.com/media/sounds/party-harder-hands-up.mp3",
  "today's-a-special-day": "https://www.myinstants.com/media/sounds/special-day.mp3",
  "you-ready-for-this": "https://www.myinstants.com/media/sounds/you-ready-for-this.mp3"
}

function getRandomSongStartedComment() {
  const keys = Object.keys(song_starting)
  const randomKeyIndex = _.random(0, keys.length - 1, false)
  const randomKey = keys[randomKeyIndex]
  const path = song_starting[randomKey]
  return path
}

function getRandomSongEndedComment() {
  const keys = Object.keys(song_ended)
  const randomKeyIndex = _.random(0, keys.length - 1, false)
  const randomKey = keys[randomKeyIndex]
  const path = song_ended[randomKey]
  return path
}

function getRandomSongPlayingComment() {
  const keys = Object.keys(comment)
  const randomKeyIndex = _.random(0, keys.length - 1, false)
  const randomKey = keys[randomKeyIndex]
  const path = comment[randomKey]
  return path
}

const RANDOM_START_COMMENT_PROBABILITY = 1 / 5
const MIN_COMMENT_DELAY_MS = 15 * 60 * 1000
const MAX_COMMENT_DELAY_MS = 45 * 60 * 1000

class VoiceModerator {
  private musicPlayer: MusicPlayer
  private commentTimer: NodeJS.Timeout
  private unsubscribe: () => void
  private defaultVolume = 50

  constructor(musicPlayer: MusicPlayer) {
    this.musicPlayer = musicPlayer
  }

  init() {
    this.initCommentTimer()

    const unsubscribe = this.musicPlayer.queue.subscribeCurrentElement(element => {
      const playRandomSound = _.random(0, 100, false) < RANDOM_START_COMMENT_PROBABILITY * 100
      if (!playRandomSound) return

      if (element && !this.musicPlayer.paused) {
        this.musicPlayer.playSound(getRandomSongStartedComment(), this.defaultVolume)
      } else {
        this.musicPlayer.playSound(getRandomSongEndedComment(), this.defaultVolume)
      }
    })

    this.unsubscribe = unsubscribe
  }

  kill() {
    if (this.commentTimer) {
      clearTimeout(this.commentTimer)
      this.commentTimer = null
    }
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  private initCommentTimer() {
    this.commentTimer = this.createRecurringTimer()
  }

  private createRecurringTimer() {
    const delay = _.random(MIN_COMMENT_DELAY_MS, MAX_COMMENT_DELAY_MS)
    const timer = setTimeout(() => {
      if (this.musicPlayer.playing && !this.musicPlayer.paused) {
        this.musicPlayer.playSound(getRandomSongPlayingComment(), this.defaultVolume)
      }
      this.commentTimer = this.createRecurringTimer()
    }, delay)

    return timer
  }
}

export default VoiceModerator

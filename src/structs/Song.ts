import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { videoPattern, isURL } from "../utils/patterns";

import { stream, video_basic_info } from "play-dl";

export interface SongData {
  url: string;
  title: string;
  duration: number;
}

export class Song {
  readonly url: string;
  readonly title: string;
  readonly duration: number;

  constructor({ url, title, duration }: SongData) {
    this.url = url;
    this.title = title;
    this.duration = duration;
  }

  static async from(url: string = "", search: string = "") {
    const isYoutubeUrl = videoPattern.test(url);

    let songInfo;

    if (isYoutubeUrl) {
      songInfo = await video_basic_info(url);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    } else {
      const result = await youtube.searchOne(search);

      result ? null : console.log(`No results found for ${search}`);

      if (!result) {
        const err = new Error(`No search results found for ${search}`);

        err.name = "NoResults";

        if (isURL.test(url)) err.name = "InvalidURL";

        throw err;
      }

      songInfo = await video_basic_info(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: songInfo.video_details.url,
        title: songInfo.video_details.title,
        duration: parseInt(songInfo.video_details.durationInSec)
      });
    }
  }

  async makeResource(): Promise<AudioResource<Song> | void> {
    let playStream;

    const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

    if (source === "youtube") {
      playStream = await stream(this.url);
    }

    if (!stream) return;

    return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
  }

  startMessage() {
    return "Now playing: " + this.title;
  }
}
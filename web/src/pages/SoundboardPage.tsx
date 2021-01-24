import React from "react"
import SoundboardArea from "../components/Soundboard/SoundboardArea"

interface Props {
  guildID: GuildID
}

function SoundboardPage(props: Props) {
  const { guildID } = props

  return <SoundboardArea guildID={guildID} />
}

export default SoundboardPage

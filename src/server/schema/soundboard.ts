import { composeMongoose } from "graphql-compose-mongoose"
import SoundboardItemModel from "../../db/models/soundboard-item"

const SoundboardItemTC = composeMongoose(SoundboardItemModel, {})

export default SoundboardItemTC

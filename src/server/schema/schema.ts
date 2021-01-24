import { Resolver, schemaComposer } from "graphql-compose"
import { MyClient } from "../../bot/MyClient"
import { getGuildTC } from "./guild"
import { getPlayerTC } from "./player"
import PlaylistTC from "./playlist"
import SoundboardItemTC from "./soundboard"
import TrackTC from "./track"

export function createSchema(client: MyClient) {
  const GuildTC = getGuildTC(client)

  const PlayerTC = getPlayerTC(client)

  schemaComposer.Query.addFields({
    trackById: TrackTC.mongooseResolvers.findById({ lean: true }),
    trackByIds: TrackTC.mongooseResolvers.findByIds({ lean: true }),
    trackOne: TrackTC.mongooseResolvers.findOne({ lean: true }),
    trackMany: TrackTC.mongooseResolvers.findMany({ lean: true, filter: { operators: true } }),
    trackDataLoader: TrackTC.mongooseResolvers.dataLoader(),
    trackDataLoaderMany: TrackTC.mongooseResolvers.dataLoaderMany(),
    trackCount: TrackTC.mongooseResolvers.count(),
    trackConnection: TrackTC.mongooseResolvers.connection(),
    trackPagination: TrackTC.mongooseResolvers.pagination(),
    trackRecents: TrackTC.getResolver("trackRecents"),

    playlistById: PlaylistTC.mongooseResolvers.findById({ lean: true }),
    playlistByIdUpdated: PlaylistTC.getResolver("playlistByIdUpdated"),
    playlistByIds: PlaylistTC.mongooseResolvers.findByIds({ lean: true }),
    playlistOne: PlaylistTC.mongooseResolvers.findOne({ lean: true }),
    playlistMany: PlaylistTC.mongooseResolvers.findMany({ lean: true, sort: { multi: true } }),
    playlistDataLoader: PlaylistTC.mongooseResolvers.dataLoader(),
    playlistDataLoaderMany: PlaylistTC.mongooseResolvers.dataLoaderMany(),
    playlistCount: PlaylistTC.mongooseResolvers.count(),
    playlistConnection: PlaylistTC.mongooseResolvers.connection(),
    playlistPagination: PlaylistTC.mongooseResolvers.pagination(),
    playlistRecents: PlaylistTC.getResolver("playlistRecents"),

    soundboardItemById: SoundboardItemTC.mongooseResolvers.findById(),
    soundboardItemByIds: SoundboardItemTC.mongooseResolvers.findByIds(),
    soundboardItemOne: SoundboardItemTC.mongooseResolvers.findOne(),
    soundboardItemMany: SoundboardItemTC.mongooseResolvers.findMany(),
    soundboardItemDataLoader: SoundboardItemTC.mongooseResolvers.dataLoader(),
    soundboardItemDataLoaderMany: SoundboardItemTC.mongooseResolvers.dataLoaderMany(),
    soundboardItemCount: SoundboardItemTC.mongooseResolvers.count(),
    soundboardItemConnection: SoundboardItemTC.mongooseResolvers.connection(),
    soundboardItemPagination: SoundboardItemTC.mongooseResolvers.pagination(),

    getGuilds: GuildTC.getResolver("getAll"),

    getPlayer: PlayerTC.getResolver("getPlayer")
  })

  schemaComposer.Mutation.addFields({
    trackCreateOne: TrackTC.mongooseResolvers.createOne(),
    trackCreateMany: TrackTC.mongooseResolvers.createMany(),
    trackUpdateById: TrackTC.mongooseResolvers.updateById(),
    trackUpdateOne: TrackTC.mongooseResolvers.updateOne(),
    trackUpdateMany: TrackTC.mongooseResolvers.updateMany(),
    trackRemoveById: TrackTC.mongooseResolvers.removeById(),
    trackRemoveOne: TrackTC.mongooseResolvers.removeOne(),
    trackRemoveMany: TrackTC.mongooseResolvers.removeMany(),

    playlistCreateOne: PlaylistTC.mongooseResolvers.createOne(),
    playlistCreateMany: PlaylistTC.mongooseResolvers.createMany(),
    playlistUpdateById: PlaylistTC.mongooseResolvers.updateById(),
    playlistUpdateOne: PlaylistTC.mongooseResolvers.updateOne(),
    playlistUpdateMany: PlaylistTC.mongooseResolvers.updateMany(),
    playlistRemoveById: PlaylistTC.mongooseResolvers.removeById(),
    playlistRemoveOne: PlaylistTC.mongooseResolvers.removeOne(),
    playlistRemoveMany: PlaylistTC.mongooseResolvers.removeMany(),

    soundboardItemCreateOne: SoundboardItemTC.mongooseResolvers.createOne(),
    soundboardItemCreateMany: SoundboardItemTC.mongooseResolvers.createMany(),
    soundboardItemUpdateById: SoundboardItemTC.mongooseResolvers.updateById(),
    soundboardItemUpdateOne: SoundboardItemTC.mongooseResolvers.updateOne(),
    soundboardItemUpdateMany: SoundboardItemTC.mongooseResolvers.updateMany(),
    soundboardItemRemoveById: SoundboardItemTC.mongooseResolvers.removeById(),
    soundboardItemRemoveOne: SoundboardItemTC.mongooseResolvers.removeOne(),
    soundboardItemRemoveMany: SoundboardItemTC.mongooseResolvers.removeMany(),

    updateQueue: PlayerTC.getResolver("updateQueue")
  })

  interface ApolloContext {}

  // TODO add auth middleware (see https://github.com/graphql-compose/graphql-compose-mongoose#access-and-modify-mongoose-doc-before-save)
  function adminAccess(resolvers: { [key: string]: Resolver<any, ApolloContext, any, any> }) {
    Object.keys(resolvers).forEach(k => {
      resolvers[k] = resolvers[k].wrapResolve(next => async rp => {
        return next(rp)
      })
    })
    return resolvers
  }

  const schema = schemaComposer.buildSchema()
  return schema
}

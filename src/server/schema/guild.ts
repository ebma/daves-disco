import { schemaComposer } from "graphql-compose"
import { MyClient } from "../../bot/MyClient"

const MemberTC = schemaComposer.createObjectTC({
  name: "Member",
  fields: {
    id: "String!",
    name: "String!"
  }
})

export function getGuildTC(client: MyClient) {
  const GuildTC = schemaComposer.createObjectTC({
    name: "Guild",
    fields: {
      id: "String!",
      name: "String!",
      members: {
        type: () => MemberTC.NonNull.List,
        args: {},
        resolve: (source, args, context, info) => {
          const guildID = source.id
          const guild = client.guilds.cache.find(guild => guild.id == guildID)
          if (guild) {
            const members: ReducedMembers = guild.members.cache.map(member => ({
              id: member.id,
              name: member.displayName
            }))
            return members
          } else {
            return null
          }
        }
      }
    }
  })

  GuildTC.addResolver({
    name: "getAll",
    args: {},
    type: GuildTC.NonNull.List,
    resolve: async () => {
      const guilds: ReducedGuilds = client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }))
      return guilds
    }
  })

  return GuildTC
}

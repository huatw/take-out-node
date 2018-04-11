const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

const OwnerType = new GraphQLObjectType({
  name: 'OwnerType',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    nickname: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: user => user.createtime.toISOString()
    }
  }
})

module.exports = OwnerType
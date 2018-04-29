const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} = require('graphql')

const AddressType = require('./Address')
const RestaurantType = require('./Restaurant')

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    username: { type: GraphQLString },
    nickname: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    address: { type: AddressType },
    saved: { type: new GraphQLList(RestaurantType) }
  }
})

module.exports = UserType
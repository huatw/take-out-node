const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

const AddressType = require('./Address')
const OwnerType = require('./Owner')

const RestaurantType = new GraphQLObjectType({
  name: 'RestaurantType',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    description: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    updatetime: {
      type: GraphQLString,
      resolve: ({ updatetime }) => updatetime.toISOString()
    },
    address: { type: AddressType },
    owner: { type: OwnerType }
  }
})

module.exports = RestaurantType
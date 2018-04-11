const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} = require('graphql')

const AddressType = require('./Address')
const RestaurantType = require('./Restaurant')
const UserType = require('./User')

const OrderType = new GraphQLObjectType({
  name: 'OrderType',
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLInt },
    status: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    finishtime: {
      type: GraphQLString,
      resolve: ({ finishtime }) => finishtime.toISOString()
    },
    restaurant: { type: RestaurantType },
    address: { type: AddressType },
    user: { type: UserType }
  }
})

module.exports = OrderType
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql')

const { User, Restaurant } = require('../../models')

const AddressType = require('./Address')
const RestaurantType = require('./Restaurant')
const UserType = require('./User')
const OrderFoodType = require('./OrderFood')
const RatingType = require('./Rating')

const OrderType = new GraphQLObjectType({
  name: 'OrderType',
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLInt },
    status: { type: GraphQLInt },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    finishtime: {
      type: GraphQLString,
      resolve: ({ finishtime }) => finishtime && finishtime.toISOString()
    },
    address: { type: AddressType },
    orderFoods: { type: new GraphQLList(OrderFoodType) },
    rating: { type: RatingType },
    user: {
      type: UserType,
      resolve: ({ user }) => User.findById(user).populate('saved')
    },
    restaurant: {
      type: RestaurantType,
      resolve: ({ restaurant }) => Restaurant.load(restaurant)
    }
  }
})

module.exports = OrderType
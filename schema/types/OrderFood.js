const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt
} = require('graphql')

const OrderType = require('./Order')
const UserType = require('./User')
const FoodType = require('./Food')

const OrderFoodType = new GraphQLObjectType({
  name: 'OrderFoodType',
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    price: { type: GraphQLInt }, // quantity * food price
    food: { type: FoodType },
    order: { type: OrderType },
    user: { type: UserType }
  }
})

module.exports = OrderFoodType
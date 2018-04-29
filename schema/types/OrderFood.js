const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt
} = require('graphql')

const { Food } = require('../../models')

const OrderType = require('./Order')
const UserType = require('./User')
const FoodType = require('./Food')

const OrderFoodType = new GraphQLObjectType({
  name: 'OrderFoodType',
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    food: {
      type: FoodType,
      resolve: ({ food }) => Food.load(food)
    },
  }
})

module.exports = OrderFoodType
import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt
} from 'graphql'

import Food from '../../models/Food'

import FoodType from './Food'

const OrderFoodType = new GraphQLObjectType({
  name: 'OrderFoodType',
  fields: {
    id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    food: {
      type: FoodType,
      resolve: ({ food }) => Food.load(food)
    }
  }
})

export default OrderFoodType

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

import Restaurant from '../../models/Restaurant'
import RestaurantType from './Restaurant'

const FoodType = new GraphQLObjectType({
  name: 'FoodType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    cuisine: { type: GraphQLString },
    description: { type: GraphQLString },
    available: { type: GraphQLBoolean },
    price: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    restaurant: {
      type: RestaurantType, // circular dependency...
      resolve: ({ restaurant }) => Restaurant.load(restaurant)
    }
  })
})

export default FoodType

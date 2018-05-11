import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} from 'graphql'

import { User, Restaurant } from '../../models'

import AddressType from './Address'
import RestaurantType from './Restaurant'
import UserType from './User'
import OrderFoodType from './OrderFood'
import RatingType from './Rating'

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

export default OrderType

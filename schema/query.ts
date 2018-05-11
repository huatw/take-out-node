import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull
} from 'graphql'

import AddressType from './types/Address'
import UserType from './types/User'
import OwnerType from './types/Owner'
import RestaurantType from './types/Restaurant'
import FoodType from './types/Food'
import OrderType from './types/Order'
import RatingType from './types/Rating'
import SearchType, {
  NAME,
  CUISINE,
  CHEAP,
  QUICK,
  SAVED,
  RATING,
  HOT
} from './types/Search'

import {
  requireLogoutHOF,
  requireLoginHOF
} from '../middlewares/authorization'

import {
  Restaurant,
  Order,
  Food,
} from '../models'

import { getAddress } from '../middlewares/gps'

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    session: { // get my session profile
      type: UserType,
      resolve: requireLoginHOF((_, args, { user }) => user)
    },
    address: {
      type: AddressType,
      args: {
        longitude: { type: new GraphQLNonNull(GraphQLFloat) },
        latitude: { type: new GraphQLNonNull(GraphQLFloat) }
      },
      resolve: async (_, { longitude, latitude }, req) =>
        getAddress(longitude, latitude)
    },
    restaurants: {
      type: new GraphQLList(RestaurantType),
      args: {
        gps: { type: new GraphQLList(GraphQLFloat) },
        keyword: { type: GraphQLString },
        type: { type: new GraphQLNonNull(SearchType) }
      },
      resolve: async (_, { gps = [], keyword = '', type }, req) => {
        switch (type) {
          case NAME:
            return Restaurant.loadByName(keyword, gps)
          case CUISINE:
            return Restaurant.loadByCuisine(keyword, gps)
          case QUICK:
            return Restaurant.loadByDistance(gps)
          case CHEAP:
            return Restaurant.loadByPrice(gps)
          case HOT:
            return Restaurant.loadByHot(gps)
          case RATING:
            return Restaurant.loadByRating(gps)
          case SAVED:
            return req.user.saved
        }
      }
    },
    restaurant: {
      type: RestaurantType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }) => Restaurant.load(id)
    },
    food: {
      type: FoodType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // food id
      resolve: (_, { id }) => Food.load(id)
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve: requireLoginHOF((_, args, req) =>
        Order.loadByUser(req.user._id)
      )
    },
    order: {
      type: OrderType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // order id
      resolve: requireLoginHOF((_, { id }) => Order.load(id))
    },
    restaurantRatings: {
      type: new GraphQLList(RatingType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // restaurant id
      resolve: (_, { id }) => Order.loadRatingByRestaurant(id)
    }
  })
})

export default Query

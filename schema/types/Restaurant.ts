import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql'

import { Food, User } from '../../models'

import AddressType from './Address'
import FoodType from './Food'

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
    nsaved: { type: GraphQLInt },
    avgrating: {
      type: GraphQLFloat,
      resolve: ({ avgrating }) => avgrating.toFixed(1)
    },
    avgprice: {
      type: GraphQLFloat,
      resolve: ({ avgprice }) => avgprice.toFixed(1)
    },
    foods: {
      type: new GraphQLList(FoodType),
      resolve: ({ id }) => Food.loadByRestaurant(id)
    },
    issaved: {
      type: GraphQLBoolean,
      resolve: ({ id }, _, { user }) => {
        if (user) {
          return User.isSaved(user._id, id)
        }
        return false
      }
    }
  }
})

export default RestaurantType

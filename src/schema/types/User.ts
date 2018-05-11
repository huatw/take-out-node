import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql'

import AddressType from './Address'
import RestaurantType from './Restaurant'

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    username: { type: GraphQLString },
    nickname: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    address: { type: AddressType },
    saved: { type: new GraphQLList(RestaurantType) }
  }
})

export default UserType

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
} from 'graphql'

import OrderType from './Order'
import UserType from './User'

const RatingType = new GraphQLObjectType({
  name: 'RatingType',
  fields: {
    id: { type: GraphQLID },
    nickname: { type: GraphQLString },
    content: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime && createtime.toISOString()
    },
    stars: { type: GraphQLInt }
  }
})

export default RatingType

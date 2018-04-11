const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

const OrderType = require('./Order')
const UserType = require('./User')

const RatingType = new GraphQLObjectType({
  name: 'RatingType',
  fields: {
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    order: { type: OrderType },
    user: { type: UserType }
  }
})

module.exports = RatingType
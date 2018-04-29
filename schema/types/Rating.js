const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt
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
      resolve: ({ createtime }) => createtime && createtime.toISOString()
    },
    stars: { type: GraphQLInt }
  }
})

module.exports = RatingType
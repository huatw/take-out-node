const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLBoolean,
  GraphQLInt
} = require('graphql')

const { Restaurant } = require('../../models')

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
      type: require('./Restaurant'), // circular dependency...
      resolve: ({ restaurant }) => Restaurant.load(restaurant)
    }
  })
})

module.exports = FoodType
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = require('graphql')

const { Food } = require('../../models')

const AddressType = require('./Address')
const FoodType = require('./Food')

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
    nsale: { type: GraphQLInt },
    price: { type: GraphQLInt },
    nrating: { type: GraphQLInt },
    rating: { type: GraphQLInt },
    foods: {
      type: new GraphQLList(FoodType),
      resolve: ({ id }) => Food.loadByRestaurant(id)
    }
  }
})

module.exports = RestaurantType
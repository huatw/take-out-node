const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull
} = require('graphql')

const UserType = require('./types/User')
const AddressType = require('./types/Address')
const OwnerType = require('./types/Owner')
const RestaurantType = require('./types/Restaurant')
const FoodType = require('./types/Food')
const OrderType = require('./types/Order')
const RatingType = require('./types/Rating')
const {
  SearchType,
  NAME,
  CUISINE,
  CHEAP,
  QUICK,
  SAVED,
  HOT
} = require('./types/Search')

const {
  requireLogoutHOF,
  requireLoginHOF
} = require('../middlewares/authorization')

const {
  Restaurant
} = require('../models')

const { getAddress } = require('../middlewares/gps')

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
    orders: {
      type: new GraphQLList(OrderType),
      resolve: requireLoginHOF((_, args, req) => Order.loadByUser(req.user._id))
    },
    /*TODO*/
    food: {
      type: FoodType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // food id
      resolve: (_, { id }) => Food.load(id)
    },
    order: {
      type: OrderType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // order id
      resolve: requireLoginHOF((_, { id }) => Order.load(id))
    },
    restaurantRatings: {
      type: new GraphQLList(RatingType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // restaurant id
      resolve: (_, { id }) => Rating.loadByRestaurant(id)
    },
    rating: {
      type: RatingType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: (_, { id }) => Rating.load(id)
    },
  })
})

module.exports = Query

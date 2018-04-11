const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')

const UserType = require('./types/User')
const OwnerType = require('./types/Owner')
const RestaurantType = require('./types/Restaurant')
const FoodType = require('./types/Food')
const OrderType = require('./types/Order')
const {
  SearchType,
  NAME,
  CUISINE,
  LATEST
} = require('./types/Search')

const {
  requireLogoutHOC,
  requireLoginHOC,
  loginHOC
} = require('../middlewares/authorization')

const {
  User
} = require('../models')

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logout: { // get my session profile
      type: GraphQLBoolean,
      resolve: requireLoginHOC((_, args, req) => {
        req.logout()
        return true
      })
    },
    login: { // get my session profile
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: loginHOC((_, args, { user }) => user)
    },
    registerUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        nickname: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: requireLogoutHOC((_, { username, password, nickname }, req) =>
        User.register({ username, password, nickname })
      )
    },
//     updateUser: {},
    // createOrder: {},
//     cancelOrder: {},
    // rateOrder: {},
    // updateOrder: {},
    // removeOrder: {},
    /**owner operation**/
    // createRestaurant: {},
    // updateRestaurant: {},
    // removeRestaurant: {},
    // createFood: {},
    // archiveFood: {}, // no longer sell
    // updateFood: {}, // update profile
    // acceptOrder: {}, // start order time
    // rejectOrder: {},
    // finishOrder: {},
  })
})

module.exports = Mutation

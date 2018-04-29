const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')

const UserType = require('./types/User')
const AddressType = require('./types/Address')
const OwnerType = require('./types/Owner')
const RestaurantType = require('./types/Restaurant')
const FoodType = require('./types/Food')
const OrderType = require('./types/Order')
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
  requireLoginHOF,
  login
} = require('../middlewares/authorization')

const {
  User,
  Order
} = require('../models')

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    logout: {
      type: GraphQLBoolean,
      resolve: requireLoginHOF((_, args, req) => {
        req.logout()

        return true
      })
    },
    login: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: requireLogoutHOF((_, { username, password }, req) =>
        login({ req, username, password })
      )
    },
    registerUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        nickname: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: requireLogoutHOF(async (_, { username, password, nickname }, req) => {
        await User.register({ username, password, nickname })

        return login({ req, username, password })
      })
    },
    updateUser: {
      type: UserType,
      args: {
        password: { type: new GraphQLNonNull(GraphQLString) },
        nickname: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: requireLoginHOF(async (_, { password, nickname }, req) => {
        const patch = {}

        if (nickname !== '') {
          patch.nickname = nickname
        }

        if (password !== '') {
          patch.password = password
        }

        Object.assign(req.user, patch)

        return req.user.save()
      })
    },
    createOrder: {
      type: OrderType,
      arges: {
        foods: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
        quantities: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) },
        address: { type: new GraphQLNonNull(GraphQLString) },
        restaurant: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve: requireLoginHOF((_, { foods, quantities, address, restaurant }, { user }) => {
        if (foods.length !== quantities.length) {
          throw Error('foods and quantities should have same length.')
        }

        return Order.create({ foods, quantities, full: address, restaurant, user: user._id })
      })
    },
    // cancelOrder: {},
    // finishOrder: {},
    // createRate: {},
    // removeRate: {},
    /**owner operation**/
    // createRestaurant: {},
    // updateRestaurant: {},
    // removeRestaurant: {},
    // createFood: {},
    // archiveFood: {}, // no longer sell
    // updateFood: {}, // update profile
  })
})

module.exports = Mutation

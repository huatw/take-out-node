const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt
} = require('graphql')

const UserType = require('./types/User')
const OwnerType = require('./types/Owner')
const RestaurantType = require('./types/Restaurant')
const FoodType = require('./types/Food')
const OrderType = require('./types/Order')
const RatingType = require('./types/Rating')
const {
  SearchType,
  NAME,
  CUISINE,
  LATEST
} = require('./types/Search')

const {
  requireLogoutHOC,
  requireLoginHOC
} = require('../middlewares/authorization')

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    session: { // get my session profile
      type: UserType,
      resolve: requireLoginHOC((_, args, { user }) => user)
    },
    restaurants: {
      type: new GraphQLList(RestaurantType),
      args: {
        // gps: { type: new GraphQLNonNull(GraphQLString) } //address: { type: AddressType },
        type: { type: SearchType }
      },
      resolve (_, { type }) {
        // return Song.find({})
        // if (type === NAME) {}
        return [{
          name: 'rest123',
          createtime: new Date()
        }]
      }
    },
    restaurant: {
      type: RestaurantType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve (_, { id }) {
        // return Restaurant.findById(id)
        return {
          name: 'rest123',
          createtime: new Date()
        }
      }
    },
    foods: {
      type: new GraphQLList(FoodType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // restaurantid
      resolve (_, { id }) {
        // return Food.find({restaurant: id})
        return [{
          name: 'foods123',
          createtime: new Date()
        }]
      }
    },
    food: {
      type: FoodType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // food id
      resolve (_, { id }) {
        // return Food.findById(id)
        return {
          name: 'rest123',
          createtime: new Date()
        }
      }
    },
    orders: {
      type: new GraphQLList(OrderType),
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // userid
      resolve: requireLoginHOC((_, { username }) => {
        // return Order.find({user: username})
        return [{
          price: 123,
          createtime: new Date()
        }]
      })
    },
    order: {
      type: OrderType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // order id
      resolve: requireLoginHOC((_, { id }) => {
        // return Order.findById(id)
        return {
          name: 'rest123',
          createtime: new Date()
        }
      })
    },
    ratings: {
      type: RatingType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // restaurant id
      resolve: (_, { id }) => {
        // return Rating.findById({ restuarnt: id })
        return {
          name: 'rest123',
          createtime: new Date()
        }
      }
    },
//     ownerSession: {},
    // user: { // view other one's page
    //   args: {
    //     username: { type: new GraphQLNonNull(GraphQLString) }
    //   },
    // },
    // ordersByOwner: { // get my all orders
    //   type: new GraphQLList(OrderType),
    //   args: { id: { type: new GraphQLNonNull(GraphQLID) } }, // userid restaurantid
    //   resolve () {
    //     // return Song.find({})
    //     return [{
    //       name: 'rest123',
    //       createtime: new Date()
    //     }]
    //   }
    // }
  })
})

module.exports = Query

const mongoose = require('mongoose')

const { DB_PATH } = require('../config')
const { Food, Order, Owner, Rating, Restaurant, User } = require('../models')

const users = require('./users.json')
const restaurants = require('./restaurants.json')
const foods = require('./foods.json')
const orders = require('./orders.json')

mongoose.Promise = global.Promise

const addRestaurants = async (restaurants) =>
  Restaurant.insertMany(restaurants)

const addUsers = async (users) =>
  User.insertMany(users)

/**
 * user1 add 1 restaurants, user2 add 2...
 * @param  {User[]} userArr
 * @param  {Restaurant[]} restaurantArr
 */
const mockSave = async (userIds, restaurantIds) => Promise.all(
  userIds.map((userId, index) => Promise.all(
    restaurantIds
      .slice(0, index + 1)
      .map(restaurantId => User.saveRestaurant(userId, restaurantId))
  ))
)


/**
 * add foods to every restaurant
 * @param  {Object[]} foods
 * @param  {ID[]}     restaurantIds
 * @return {Food[][]} restaurant array of food array
 */
const addFoods = async (foods, restaurantIds) => Promise.all(
  restaurantIds.map((restaurant, index) => {
    const refinedFoods = foods.map(
      ({ name, cuisine, description, price }) => ({
        name: `r${index}${name}`,
        cuisine: `r${index}${cuisine}`,
        description: `r${index}${description}`,
        price,
        restaurant
      })
    )

    return Food.insertMany(refinedFoods)
  })
)

/**
 * create orders for users
 * @param  {Object[]} orders
 * @param  {ID[]} userIds
 * @param  {ID[]} restaurantIds
 * @param  {ID[][]} foodRestaurantIds len = restaurantIds.length
 * @return {Order[][][]|Promise}
 */
const addOrders = async (orders, userIds, restaurantIds, foodRestaurantIds) => Promise.all(
  userIds.map(user => Promise.all(
    restaurantIds.map((restaurant, index) => Promise.all(
      orders.map(({ full }) =>
        Order.create({
          foods: foodRestaurantIds[index],
          quantities: foodRestaurantIds[index].map((_, i) => i + 1),
          full,
          restaurant,
          user
        })
      )
    ))
  ))
)

/**
 * complete order and rate.
 * @param  {Order[][][]} orderRestaurantUserArr
 * @return {Order[][][]|Promise}
 */
const mockCompleteAndRating = async (orderRestaurantUserArr) => Promise.all(
  orderRestaurantUserArr.map(orderRestaurantArr => Promise.all(
    orderRestaurantArr.map(orderArr => Promise.all(
      orderArr.map(order => Order.complete(order._id, 'great!', 5))
    ))
  ))
)

/**
 * 1 Restaurant
 * 2.1 User dependent on Restaurant
 * 2.2 Food dependent on Restaurant
 * 3 Order dependent on User, Restaurant, Food
 * 4 Rating dependent on Order
 */
async function runSeed () {
  const restaurantArr = await addRestaurants(restaurants)
  const restaurantIds = restaurantArr.map(restaurant => restaurant._id)

  const userArr = await addUsers(users)
  const userIds = userArr.map(user => user._id)

  await mockSave(userIds, restaurantIds)

  const foodRestaurantArr = await addFoods(foods, restaurantIds)
  const foodRestaurantIds = foodRestaurantArr.map(
    foodArr => foodArr.map(({ _id }) => _id)
  )

  const orderRestaurantUserArr = await addOrders(
    orders,
    userIds,
    restaurantIds,
    foodRestaurantIds
  )

  await mockCompleteAndRating(orderRestaurantUserArr)
}

mongoose
  .connect(DB_PATH, { autoIndex: true })
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => runSeed())
  .then(() => console.log('Seeding successfully! Ctrl-C to quit.'))
  // .then(() => mongoose.disconnect())

const mongoose = require('mongoose')

const AddressSchema = require('./Address')
const OrderFoodShema = require('./OrderFood')
const RatingSchema = require('./Rating')
const Food = require('./Food')
const Restaurant = require('./Restaurant')

const OrderSchema = mongoose.Schema({
  // _id auto gen
  restaurant: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Restaurant',
    index: true,
    required: true
  },
  user: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  orderFoods: [OrderFoodShema],
  rating: RatingSchema,
  address: AddressSchema,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { // 0: ongoing 1: done 2: canceled
    type: Number,
    required: true,
    default: 0
  },
  createtime: {
    type: Date,
    default: Date.now
  },
  finishtime: { type: Date }
})

// used to check aggregate user && Restaurant
OrderSchema.index(
  { user: 1, restaurant: 1 }
)

OrderSchema.statics = {
  /**
   * create Order
   * @param  {_id[]} options.foods         _id array of food
   * @param  {Number[]} options.quantities quantity array
   * @param  {String} options.full         full address
   * @param  {_id} options.restaurant      restaurant _id
   * @param  {_id} options.user            user _id
   * @return {Order}
   */
  async create ({ foods, quantities, full, restaurant, user }) {
    const foodQuanMap = foods.reduce(
      (acc, id, index) => {
        acc[id] = quantities[index]
        return acc
      },
      {}
    )

    const orderFoods = foods.map((food, index) => ({
      food,
      quantity: quantities[index]
    }))

    const quantity = quantities.reduce((a, b) => a + b)

    const foodObjs = await Food.find({ _id: { $in: foods } })

    const price = foodObjs.reduce(
      (acc, { price, _id }) => acc + price * foodQuanMap[_id],
      0
    )

    const order = new this({
      restaurant,
      user,
      address: { full },
      orderFoods,
      quantity,
      price
    })

    return order.save()
  },
  async complete (_id, user, content, stars = 5) { // check user
    const order = await this.findOneAndUpdate(
      { _id, user },
      {
        $set: {
          status: 1,
          finishtime: Date.now(),
          rating: {
            content,
            stars,
            createtime: Date.now()
          }
        }
      },
      { new: true }
    )

    if (!order) {
      throw Error('not your order.')
    }

    /* Restaurant aggregation data update */
    await Restaurant.updateSale(order.restaurant, order.price)
    await Restaurant.updateRating(order.restaurant, stars)

    return order
  },
  async cancel (_id, user) {
    const order = await this.findOneAndUpdate(
      { _id, user },
      {
        $set: {
          finishtime: Date.now(),
          status: 2
        }
      },
      { new: true }
    )

    return order
  },
  load (_id) {
    return this.findById(_id)
  },
  loadByUser (user) {
    return this.find({ user })
      .sort({ createtime: -1 })
  },
  async loadRatingByRestaurant (restaurant) {
    const orders = await this
      .find({ restaurant })
      .populate('user')
      .sort({ createtime: -1 })

    const ratings = orders
      .filter(order => order.rating)
      .map(({ user: { nickname }, rating }) => ({
        // ...rating, // cannot destructor rating using ...
        id: rating._id,
        content: rating.content,
        stars: rating.stars,
        createtime: rating.createtime,
        nickname
      }))

    return ratings
  }
}

module.exports = mongoose.model('Order', OrderSchema)

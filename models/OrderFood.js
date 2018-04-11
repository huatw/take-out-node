const mongoose = require('mongoose')

const OrderFoodSchema = mongoose.Schema({
  // _id auto gen
  food: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Food',
    index: true,
    required: true
  },
  order: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Order',
    index: true,
    required: true
  },
  user: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
})

// used to check aggregate user && food
// OrderFoodSchema.index(
//   { user: 1, food: 1 }
// )

OrderFoodSchema.statics = {
  loadByOrder (order) {
    return this.find({ order })
      .sort({ createtime: -1 })
      .exec()
  }
}

module.exports = mongoose.model('OrderFood', OrderFoodSchema)
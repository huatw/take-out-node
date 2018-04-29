const mongoose = require('mongoose')

const OrderFoodSchema = mongoose.Schema({
  // _id auto gen
  food: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Food',
    index: true,
    required: true
  },
  quantity: { type: Number, required: true }
})

module.exports = OrderFoodSchema

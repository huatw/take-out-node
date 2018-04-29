const mongoose = require('mongoose')

const { THUMB_NAIL_FOOD } = require('../config')

const FoodSchema = mongoose.Schema({
  // _id auto gen
  restaurant: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Restaurant',
    index: true,
    required: true
  },
  name: { type: String, required: true, minlength: 1 },
  cuisine: { type: String, minlength: 1 },
  description: { type: String },
  available: { type: Boolean, default: true },
  price: { type: Number, required: true },
  thumbnail: {type: String, default: THUMB_NAIL_FOOD},
  createtime: {
    type: Date,
    default: Date.now
  }
})

FoodSchema.statics = {
  load (_id) {
    return this.findById(_id)
  },
  loadByRestaurant (restaurant) {
    return this.find({ restaurant })
  }
}

module.exports = mongoose.model('Food', FoodSchema)

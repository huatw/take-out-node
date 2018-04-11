const mongoose = require('mongoose')

const { THUMB_NAIL_RESTAURANT } = require('../config')

const RestaurantSchema = mongoose.Schema({
  // _id auto gen
  address: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Address',
    index: true,
    required: true
  },
  owner: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Owner',
    index: true,
    required: true
  },
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 1
  },
  cuisine: { type: String, minlength: 1, index: true },
  description: { type: String },
  thumbnail: {type: String, default: THUMB_NAIL_RESTAURANT},
  createtime: {
    type: Date,
    default: Date.now
  },
  updatetime: {
    type: Date,
    default: Date.now
  }
})

RestaurantSchema.statics = {
  load (_id) {
    return this.findOne({ _id }).exec()
  },
  loadAll () { // restrict address!!!!
    return this.find({})
      .sort({ updatetime: -1 })
      .exec()
  },
  loadByName (name) { // restrict address!!!!
    return this.find({
      name: { $regex: name, $options: 'i' }
    })
      // .limit(20)
      .sort({ updatetime: -1 })
      .exec()
  },
  loadByCuisine (cuisine) { // restrict address!!!!
    return this.find({ cuisine })
      .sort({ updatetime: -1 })
      .exec()
  },
}

module.exports = mongoose.model('Restaurant', RestaurantSchema)

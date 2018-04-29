const mongoose = require('mongoose')

const AddressSchema = require('./Address')

const { THUMB_NAIL_RESTAURANT } = require('../config')

const RestaurantSchema = mongoose.Schema({
  // _id auto gen
  address: AddressSchema,
  // owner: { // index, foreign key
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref : 'Owner',
  //   index: true,
  //   required: true
  // },
  name: {
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 1
  },
  cuisine: { type: String, minlength: 1, index: true },
  description: { type: String },
  thumbnail: { type: String, default: THUMB_NAIL_RESTAURANT },
  createtime: {
    type: Date,
    default: Date.now
  },
  updatetime: {
    type: Date,
    default: Date.now
  },
  /* aggregate data */
  nsaved: {
    type: Number,
    index: true,
    default: 0
  },
  nsale: {
    type: Number,
    index: true,
    default: 0
  },
  price: {
    type: Number,
    index: true,
    default: 0
  },
  nrating: {
    type: Number,
    index: true,
    default: 0
  },
  rating: {
    type: Number,
    index: true,
    default: 0
  }
})

RestaurantSchema.statics = {
  updateRating (_id, rating) {
    return this.findByIdAndUpdate(
      _id,
      { $inc: { nrating: rating > 0 ? 1 : -1, rating } }
    )
  },
  updateSale (_id, price) {
    return this.findByIdAndUpdate(
      _id,
      { $inc: { nsale: price > 0 ? 1 : -1, price } }
    )
  },
  incNSaved (_id) {
    return this.findByIdAndUpdate(
      _id,
      { $inc: { nsaved: 1 }}
    )
  },
  decNSaved (_id) {
    return this.findByIdAndUpdate(
      _id,
      { $dec: { nsaved: 1 }}
    )
  },
  load (_id) {
    return this.findById(_id)
  },
  loadByName (name, gps) {
    if (!name) {
      return []
    }

    return this.find({
      name: { $regex: name, $options: 'i' }
    })
      .limit(20)
      .sort({ updatetime: -1 })
  },
  loadByCuisine (cuisine, gps) {
    return this.find({
      cuisine: { $regex: cuisine, $options: 'i' }
    })
      .limit(20)
      .sort({ updatetime: -1 })
  },
  loadByDistance (gps) {
    if (gps.length !== 2) {
      throw Error('invalid GPS')
    }

    return this.find({
      'address.gps': {
        $near: gps,
        $maxDistance: 10 / 111 // 10km
      },
    }).limit(20)
  },
  loadByPrice (gps) {
    if (gps.length !== 2) {
      throw Error('invalid GPS')
    }
    return this.find({
      'address.gps': {
        $near: gps,
        $maxDistance: 10 / 111 // 10km
      }
    }).sort({ avgprice: 1 }).limit(20)
  },
  loadByHot (gps) {
    if (gps.length !== 2) {
      throw Error('invalid GPS')
    }

    return this.find({
      'address.gps': {
        $near: gps,
        $maxDistance: 10 / 111 // 10km
      }
    }).sort({ nsaved: -1 }).limit(20)
  }
}

module.exports = mongoose.model('Restaurant', RestaurantSchema)

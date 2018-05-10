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
    default: 0
  },
  avgprice: {
    type: Number,
    index: true,
    default: 0
  },
  nrating: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  avgrating: {
    type: Number,
    index: true,
    default: 0
  }
})

RestaurantSchema.statics = {
  async updateRating (_id, rating) {
    const restaurant = await this.findByIdAndUpdate(
      _id,
      { $inc: { nrating: rating > 0 ? 1 : -1, rating } },
      { new: true }
    )

    if (restaurant.nrating) {
      restaurant.avgrating = restaurant.rating / restaurant.nrating
    }

    return restaurant.save()
  },
  async updateSale (_id, price) {
    const restaurant = await this.findByIdAndUpdate(
      _id,
      { $inc: { nsale: price > 0 ? 1 : -1, price } },
      { new: true }
    )

    if (restaurant.nsale) {
      restaurant.avgprice = restaurant.price / restaurant.nsale
    }

    return restaurant.save()
  },
  incNSaved (_id) {
    return this.findByIdAndUpdate(
      _id,
      { $inc: { nsaved: 1 }},
      { new: true }
    )
  },
  decNSaved (_id) {
    return this.findByIdAndUpdate(
      _id,
      { $inc: { nsaved: -1 }},
      { new: true }
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
    })
      .sort({ avgprice: 1 })
      .limit(20)
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
    })
      .sort({ nsaved: -1 })
      .limit(20)
  },
  loadByRating (gps) {
    if (gps.length !== 2) {
      throw Error('invalid GPS')
    }

    return this.find({
      'address.gps': {
        $near: gps,
        $maxDistance: 10 / 111 // 10km
      }
    })
      .sort({ avgrating: -1 })
      .limit(20)
  }
}

module.exports = mongoose.model('Restaurant', RestaurantSchema)

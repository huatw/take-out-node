const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const AddressSchema = require('./Address')
const Restaurant = require('./Restaurant')

const { THUMB_NAIL_USER, SALT_ROUNDS } = require('../config')

const UserSchema = mongoose.Schema({
  username: {// index
    type: String,
    unique: true,
    index: true,
    required: true,
    minlength: 1
  },
  password: { type: String, required: true },
  nickname: {
    type: String,
    required: true,
    minlength: 1
  },
  thumbnail: { type: String, default: THUMB_NAIL_USER },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  },
  saved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Restaurant'
  }],
  address: AddressSchema // not using it yet.
})

// auto hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, SALT_ROUNDS)
    this.password = password
  }

  next()
})

UserSchema.methods = {
  async comparePassword (cleanPassword) {
    const isMatched = await bcrypt.compare(cleanPassword, this.password)

    return isMatched
  }
}

UserSchema.statics = {
  load (username) {
    return this.findOne({ username }).populate('saved')
  },
  register ({ username, password, nickname }) {
    const user = new this({ username, password, nickname })

    return user.save()
  },
  async isSaved (_id, restaurant) {
    const user = await this.findOne({
      _id,
      saved: restaurant
    })

    return user ? true : false
  },
  async saveRestaurant (_id, restaurant) {
    await this.findByIdAndUpdate(
      _id,
      { $push: { saved: restaurant} },
      { new: true }
    )

    return Restaurant.incNSaved(restaurant)
  },
  async unsaveRestaurant (_id, restaurant) {
    await this.findByIdAndUpdate(
      _id,
      { $pull: { saved: restaurant} },
      { new: true }
    )

    return Restaurant.decNSaved(restaurant)
  }
}

module.exports = mongoose.model('User', UserSchema)

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const { THUMB_NAIL_USER, SALT_ROUNDS } = require('../config')

const OwnerSchema = mongoose.Schema({
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
  thumbnail: {type: String, default: THUMB_NAIL_USER},
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

// auto hash password before saving
OwnerSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, SALT_ROUNDS)
    this.password = password
  }

  next()
})

OwnerSchema.methods = {
  async comparePassword (cleanPassword) {
    const isMatched = await bcrypt.compare(cleanPassword, this.password)

    return isMatched
  }
}

OwnerSchema.statics = {
  load (username) {
    return this.findOne({ username }).exec()
  },
  register ({ username, password, nickname }) {
    const user = new this({ username, password, nickname })

    return user.save()
  }
}

module.exports = mongoose.model('Owner', OwnerSchema)

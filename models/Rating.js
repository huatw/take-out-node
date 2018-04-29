const mongoose = require('mongoose')

const RatingSchema = mongoose.Schema({
  content: { type: String },
  stars: {
    type: Number,
    min: 0,
    max: 5,
  },
  createtime: { type: Date }
})

module.exports = RatingSchema

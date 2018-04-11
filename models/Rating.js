const mongoose = require('mongoose')

const RatingSchema = mongoose.Schema({
  //_id primary key
  user: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User',
    index: true,
    required: true
  },
  order: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Order',
    index: true,
    required: true
  },
  restaurant: { // index, foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Restaurant',
    index: true,
    required: true
  },
  content: { type: String },
  islike: { type: Boolean, default: true, require: true },
  createtime: {
    type: Date,
    default: Date.now,
    required: true
  }
})

RatingSchema.statics = {
  load (_id) {
    return this.findOne({ _id }).exec()
  },
  // newRating ({user, photo, content}) {
  //   const Rating = new this({user, photo, content})
  //   return Rating.save()
  // },
  // loadByUser (uid) {
  //   return this.find({user: uid})
  //     .populate('photo')
  //     .sort({createtime: -1})
  //     .exec()
  // },
  // loadByPhoto (pid) {
  //   return this.find({photo: pid})
  //     .populate('user')
  //     .sort({createtime: -1})
  //     .exec()
  // }
}

module.exports = mongoose.model('Rating', RatingSchema)

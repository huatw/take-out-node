const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  // _id auto gen
  restaurant: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Restaurant',
    index: true,
    required: true
  },
  address: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Address',
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
  price: { type: Number, required: true },
  status: { type: String, required: true },
  createtime: {
    type: Date,
    default: Date.now
  },
  finishtime: { type: Date }
})

// used to check aggregate user && Restaurant
OrderSchema.index(
  { user: 1, restaurant: 1 }
)

OrderSchema.statics = {
  load (_id) {
    return this.findOne({ _id }).exec()
  },
  loadByUser (uid) {
    return this.find({ user: uid })
      .sort({ createtime: -1 })
      .exec()
  },
}

module.exports = mongoose.model('Order', OrderSchema)

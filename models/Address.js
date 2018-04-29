const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({
  // _id auto gen
  full: { type: String },
  state: { type: String },
  city: { type: String },
  street: { type: String },
  gps: { type: [Number], index: '2d'}
})

module.exports = AddressSchema

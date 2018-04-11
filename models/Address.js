const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({
  // _id auto gen
  postcode: { type: String },
  state: { type: String },
  city: { type: String },
  street: { type: String },
  gps: { type: String } // todo change to GPS
})

AddressSchema.statics = {
  load (_id) {
    return this.findOne({ _id }).exec()
  }
}

module.exports = mongoose.model('Address', AddressSchema)

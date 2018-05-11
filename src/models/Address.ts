import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
  // _id auto gen
  full: { type: String },
  state: { type: String },
  city: { type: String },
  street: { type: String },
  gps: { type: [Number], index: '2d' }
})

export interface IAddress extends mongoose.Document {
  full: string
  state: string
  city: string
  street: string
  gps: number[]
}

export default AddressSchema

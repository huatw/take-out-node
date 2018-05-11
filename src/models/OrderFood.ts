import mongoose from 'mongoose'

const OrderFoodSchema = new mongoose.Schema({
  // _id auto gen
  food: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    index: true,
    required: true
  },
  quantity: { type: Number, required: true }
})

export interface IOrderFood extends mongoose.Document {
  food: typeof mongoose.Schema.Types.ObjectId
  quantity: number
}

export default OrderFoodSchema

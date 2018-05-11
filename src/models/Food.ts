import mongoose from 'mongoose'

import { THUMB_NAIL_FOOD } from '../config'

const FoodSchema = new mongoose.Schema({
  // _id auto gen
  restaurant: { // foreign key
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    index: true,
    required: true
  },
  name: { type: String, required: true, minlength: 1 },
  cuisine: { type: String, minlength: 1 },
  description: { type: String },
  available: { type: Boolean, default: true },
  price: { type: Number, required: true },
  thumbnail: {type: String, default: THUMB_NAIL_FOOD},
  createtime: {
    type: Date,
    default: Date.now
  }
})

FoodSchema.statics = {
  load (_id) {
    return this.findById(_id)
  },
  loadByRestaurant (restaurant) {
    return this.find({ restaurant })
  }
}

export interface IFood extends mongoose.Document {
  restaurant: typeof mongoose.Schema.Types.ObjectId
  name: string
  cuisine: string
  description: string
  available: boolean
  price: number
  thumbnail: string
  createtime: Date
}

export interface IFoodModel extends mongoose.Model<IFood> {
  load: (_id: any) => Promise<IFood>
  loadByRestaurant: (restaurant: any) => Promise<IFood[]>
}

const Food: IFoodModel = mongoose.model<IFood, IFoodModel>('Food', FoodSchema)
export default Food

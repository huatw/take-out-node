import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import AddressSchema, { IAddress } from './Address'
import Restaurant, { IRestaurant } from './Restaurant'

import { THUMB_NAIL_USER, SALT_ROUNDS } from '../config'

const UserSchema = new mongoose.Schema({
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
    ref: 'Restaurant'
  }],
  address: AddressSchema // not using it yet.
})

// auto hash password before saving
UserSchema.pre('save', async function (this: any, next) {
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
  load (username: string) {
    return this.findOne({ username }).populate('saved')
  },
  register ({ username, password, nickname }) {
    const user = new this({ username, password, nickname })

    return user.save()
  },
  async isSaved (_id, restaurantId) {
    const user = await this.findOne({
      _id,
      saved: restaurantId
    })

    return !!user
  },
  async saveRestaurant (_id, restaurant) {
    await this.findByIdAndUpdate(
      _id,
      { $push: { saved: restaurant } },
      { new: true }
    )

    return Restaurant.incNSaved(restaurant)
  },
  async unsaveRestaurant (_id, restaurant) {
    await this.findByIdAndUpdate(
      _id,
      { $pull: { saved: restaurant } },
      { new: true }
    )

    return Restaurant.decNSaved(restaurant)
  }
}

export interface IUser extends mongoose.Document {
  username: string
  password: string
  nickname: string
  thumbnail: string
  createtime: Date
  saved: (typeof mongoose.Schema.Types.ObjectId)[]
  address: IAddress
  comparePassword: (password: string) => Promise<boolean>
}

export interface IUserModel extends mongoose.Model<IUser> {
  load: (username: string) => Promise<IUser>
  register: (any) => Promise<IUser>
  isSaved: (_id: any, restaurantId: any) => Promise<boolean>
  saveRestaurant: (_id: any, restaurantId: any) => Promise<IRestaurant>
  unsaveRestaurant: (_id: any, restaurantId: any) => Promise<IRestaurant>
}

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema)
export default User

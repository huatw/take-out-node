import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

import AddressSchema, { IAddress } from './Address'
import Restaurant, { IRestaurant } from './Restaurant'

import { THUMB_NAIL_USER, SALT_ROUNDS } from '../config'

const OwnerSchema = new mongoose.Schema({
  ownername: {// index
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
OwnerSchema.pre('save', async function (this: any, next) {
  if (this.isModified('password')) {
    const password = await bcrypt.hash(this.password, SALT_ROUNDS)
    this.password = password
  }

  next()
})

OwnerSchema.methods = {
  async comparePassword(cleanPassword) {
    const isMatched = await bcrypt.compare(cleanPassword, this.password)

    return isMatched
  }
}

OwnerSchema.statics = {
  load(ownername: string) {
    return this.findOne({ ownername }).populate('saved')
  },
  register({ ownername, password, nickname }) {
    const owner = new this({ ownername, password, nickname })

    return owner.save()
  }
}

export interface IOwner extends mongoose.Document {
  ownername: string
  password: string
  nickname: string
  thumbnail: string
  createtime: Date
  saved: (typeof mongoose.Schema.Types.ObjectId)[]
  address: IAddress
  comparePassword: (password: string) => Promise<boolean>
}

export interface IOwnerModel extends mongoose.Model<IOwner> {
  load: (ownername: string) => Promise<IOwner>
  register: (any) => Promise<IOwner>
}

const Owner: IOwnerModel = mongoose.model<IOwner, IOwnerModel>('Owner', OwnerSchema)
export default Owner

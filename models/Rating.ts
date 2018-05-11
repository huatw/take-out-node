import mongoose from 'mongoose'

const RatingSchema = new mongoose.Schema({
  content: { type: String },
  stars: {
    type: Number,
    min: 0,
    max: 5
  },
  createtime: { type: Date }
})

export interface IRating extends mongoose.Document {
  content: string
  stars: number
  createtime: Date
}

export default RatingSchema

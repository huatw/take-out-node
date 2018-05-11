import path from 'path'

export const DB_PATH: string = 'mongodb://localhost:27017/take-food-out'
export const SERVER_PORT: number = 8080
export const SOCKET_PORT: number = 3000
export const PUBLIC_PATH: string = path.join(__dirname, 'public')
export const SALT_ROUNDS: number = 10
export const THUMB_NAIL_USER: string = 'default_user_thumbnail.png'
export const THUMB_NAIL_FOOD: string = 'default_user_thumbnail.png'
export const THUMB_NAIL_RESTAURANT: string = 'default_user_thumbnail.png'

export default {
  DB_PATH,
  SERVER_PORT,
  SOCKET_PORT,
  PUBLIC_PATH,
  SALT_ROUNDS,
  THUMB_NAIL_USER,
  THUMB_NAIL_FOOD,
  THUMB_NAIL_RESTAURANT
}

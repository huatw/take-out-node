const path = require('path')

const config = {
  DB_PATH: 'mongodb://localhost:27017/take-food-out',
  SERVER_PORT: 8080,
  PUBLIC_PATH: path.join(__dirname, '../../client/dist'),
  SALT_ROUNDS: 10,
  THUMB_NAIL_USER: 'default_user_thumbnail.png',
  THUMB_NAIL_FOOD: 'default_user_thumbnail.png',
  THUMB_NAIL_RESTAURANT: 'default_user_thumbnail.png'
}

module.exports = config
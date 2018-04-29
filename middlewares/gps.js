const axios = require('axios')

const getAddress = async (longitude, latitude) => {
  // const { data } = await axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${longitude},${latitude}`)

  // fake full address
  const data = { results: [{ formatted_address: 'fake full address.' }] }

  // google api does not support state city ....
  return {
    gps: [longitude, latitude],
    full: data.results[0].formatted_address,
    state: '',
    city: '',
    street: ''
  }
}

module.exports = {
  getAddress
}

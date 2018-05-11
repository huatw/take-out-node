import axios from 'axios'

export const getAddress = async (longitude: number, latitude: number) => {
  const { data } = await axios.get(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${longitude},${latitude}`)
  // fake full address
  // const data = { results: [{ formatted_address: '73 E 4th St, New York, NY 10003' }] }

  // google api does not support state city ....
  return {
    gps: [longitude, latitude],
    full: (data.results[0] && data.results[0].formatted_address) || '73 E 4th St, New York, NY 10003',
    state: '',
    city: '',
    street: ''
  }
}

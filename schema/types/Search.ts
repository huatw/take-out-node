import {
  GraphQLEnumType
} from 'graphql'

export const NAME = 0
export const CUISINE = 1
export const CHEAP = 2
export const QUICK = 3
export const SAVED = 4
export const HOT = 5
export const RATING = 6

const SearchType = new GraphQLEnumType({
  name: 'Search',
  description: 'search restaurant by type',
  values: {
    NAME: {
      value: NAME,
      description: 'search by restaurant name'
    },
    CUISINE: {
      value: CUISINE,
      description: 'search by restaurant cuisine'
    },
    CHEAP: {
      value: CHEAP,
      description: 'search by price'
    },
    QUICK: {
      value: QUICK,
      description: 'search by distance'
    },
    SAVED: {
      value: SAVED,
      description: 'search by saved'
    },
    HOT: {
      value: HOT,
      description: 'search by popularity'
    },
    RATING: {
      value: RATING,
      description: 'search by rating'
    }
  }
})

export default SearchType

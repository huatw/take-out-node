const {
  GraphQLEnumType
} = require('graphql')

const NAME = 0
const CUISINE = 1
const CHEAP = 2
const QUICK = 3
const SAVED = 4
const HOT = 5

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
    }
  }
})

module.exports = {
  SearchType,
  NAME,
  CUISINE,
  CHEAP,
  QUICK,
  SAVED,
  HOT
}

const {
  GraphQLEnumType
} = require('graphql')

const NAME = 0
const CUISINE = 1
const LATEST = 2

const SearchType = new GraphQLEnumType({
  name: 'SearchType',
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
    LATEST: {
     value: LATEST,
     description: 'search by latest update'
    }
  }
})

module.exports = {
  SearchType,
  NAME,
  CUISINE,
  LATEST
}

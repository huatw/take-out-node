const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} = require('graphql')

const AddressType = new GraphQLObjectType({
  name: 'AddressType',
  fields: {
    id: { type: GraphQLID },
    postcode: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    street: { type: GraphQLString },
    gps: { type: GraphQLString }
  }
})

module.exports = AddressType
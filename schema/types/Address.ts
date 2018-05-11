import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList
} from 'graphql'

const AddressType = new GraphQLObjectType({
  name: 'AddressType',
  fields: {
    full: { type: GraphQLString },
    state: { type: GraphQLString },
    city: { type: GraphQLString },
    street: { type: GraphQLString },
    gps: { type: new GraphQLList(GraphQLFloat) }
  }
})

export default AddressType

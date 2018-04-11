const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql')

const AddressType = require('./Address')

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: {
    username: { type: GraphQLString },
    nickname: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: ({ createtime }) => createtime.toISOString()
    },
    address: {
      type: AddressType,
      resolve: ({ address }) => {
        return Address.load({ _id: address })
      }
    }
  }
})

module.exports = UserType
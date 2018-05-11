import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql'

const OwnerType = new GraphQLObjectType({
  name: 'OwnerType',
  fields: {
    id: { type: GraphQLID },
    ownername: { type: GraphQLString },
    nickname: { type: GraphQLString },
    thumbnail: { type: GraphQLString },
    createtime: {
      type: GraphQLString,
      resolve: user => user.createtime.toISOString()
    }
  }
})

export default OwnerType

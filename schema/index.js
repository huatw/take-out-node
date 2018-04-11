const graphql = require('graphql')

const { GraphQLSchema } = graphql

const query = require('./query')
const mutation = require('./mutations')

const schema = new GraphQLSchema({
  query,
  mutation
})

module.exports = schema

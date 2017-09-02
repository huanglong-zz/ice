import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList
} from 'graphql'

const parameterType = new GraphQLObjectType({
  name: 'parameters',
  fields: {
    key: {
      type: GraphQLString
    },
    value: {
      type: GraphQLString
    }
  }
})

export let ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: {
    _id: {
      type: GraphQLID
    },
    price: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    },
    intro: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString)
    },
    parameters: {
      type: new GraphQLList(parameterType)
    }
  }
})
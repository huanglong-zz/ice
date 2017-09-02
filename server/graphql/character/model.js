import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} from 'graphql'

export let WikiCharacterType = new GraphQLObjectType({
  name: 'WikiCharacter',
  fields: {
    _id: {
      type: GraphQLID
    },
    wikiId: {
      type: GraphQLInt
    },
    nmId: {
      type: GraphQLString
    },
    chId: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    cname: {
      type: GraphQLString
    },
    playedBy: {
      type: GraphQLString
    },
    profile: {
      type: GraphQLString
    },
    images: {
      type: new GraphQLList(GraphQLString)
    },
    sections: {
      type: new GraphQLList(GraphQLString)
    },
    intro: {
      type: new GraphQLList(GraphQLString)
    }
  }
})
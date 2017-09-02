import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList
} from 'graphql'

const sectionType = new GraphQLObjectType({
  name: 'sections',
  fields: {
    title: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    }
  }
})

const memberType = new GraphQLObjectType({
  name: 'swornMembers',
  fields: {
    character: {
      type: new GraphQLObjectType({
        name: 'character',
        fields: {
          _id: {
            type: GraphQLID
          },
          name: {
            type: GraphQLString
          },
          profile: {
            type: GraphQLString
          },
          cname: {
            type: GraphQLString
          },
          nmId: {
            type: GraphQLString
          }
        }
      })
    },
    text: {
      type: GraphQLString
    }
  }
})

export let WikiHouseType = new GraphQLObjectType({
  name: 'WikiHouse',
  fields: {
    _id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    cname: {
      type: GraphQLString
    },
    words: {
      type: GraphQLString
    },
    intro: {
      type: GraphQLString
    },
    cover: {
      type: GraphQLString
    },
    wikiId: {
      type: GraphQLInt
    },
    sections: {
      type: new GraphQLList(sectionType)
    },
    swornMembers: {
      type: new GraphQLList(memberType)
    }
  }
})
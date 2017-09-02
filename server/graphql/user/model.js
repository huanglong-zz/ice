import {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList
} from 'graphql'

const paymentType = new GraphQLObjectType({
  name: 'payments',
  fields: {
    product: {
      type: new GraphQLObjectType({
        name: 'product',
        fields: {
          images: {
            type: new GraphQLList(GraphQLString)
          },
          title: {
            type: GraphQLString
          },
          intro: {
            type: GraphQLString
          },
          price: {
            type: GraphQLString
          }
        }
      })
    },
    payType: {
      type: GraphQLString
    },
    totalFee: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    phoneNumber: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    }
  }
})

export let UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: GraphQLID
    },
    nickname: {
      type: GraphQLString
    },
    address: {
      type: GraphQLString
    },
    province: {
      type: GraphQLString
    },
    country: {
      type: GraphQLString
    },
    city: {
      type: GraphQLString
    },
    sex: {
      type: GraphQLString
    },
    headimgurl: {
      type: GraphQLString
    },
    avatarUrl: {
      type: GraphQLString
    }
  }
})
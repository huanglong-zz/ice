import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import ProductQueries from './product/query'
import WikiHouseQueries from './house/query'
import WikiCharacterQueries from './character/query'
import UserQueries from './user/query'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Queries',
    fields: Object.assign(
      WikiHouseQueries,
      WikiCharacterQueries,
      ProductQueries,
      UserQueries
    )
  })
})
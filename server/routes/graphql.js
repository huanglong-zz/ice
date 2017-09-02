import { controller, get, post } from '../decorator/router'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from '../graphql/schema'

@controller('')
export class GraphqlController {
  @post('graphql')
  async postGraphql (ctx, next) {
    await graphqlKoa({
      schema: schema
    })(ctx, next)
  }

  @get('graphql')
  async getGraphql (ctx, next) {
    await graphqlKoa({
      schema: schema
    })(ctx, next)
  }

  @get('graphiql')
  async getGraphiqlKoa (ctx, next) {
    await graphiqlKoa({
      endpointURL: '/graphql'
    })(ctx, next)
  }
}
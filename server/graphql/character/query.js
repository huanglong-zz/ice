import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  WikiCharacterType
} from './model'

import {
  getCharacters,
  getCharacter
} from '../../api/wiki'

const character = {
  type: WikiCharacterType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve (root, params, options) {
    const data = await getCharacter(params.id)

    return data
  }
}

const characters = {
  type: new GraphQLList(WikiCharacterType),
  args: {},
  async resolve (root, params, options) {
    const data = await getCharacters()

    return data
  }
}

export default {
  character,
  characters
}
import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import {
  WikiHouseType
} from './model'

import {
  getHouses,
  getHouse
} from '../../api/wiki'

const house = {
  type: WikiHouseType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve (root, params, options) {
    const data = await getHouse(params.id)

    return data
  }
}

const houses = {
  type: new GraphQLList(WikiHouseType),
  args: {},
  async resolve (root, params, options) {
    const data = await getHouses()

    return data
  }
}

export default {
  house,
  houses
}
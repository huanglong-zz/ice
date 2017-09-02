import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} from 'graphql'

import {
  UserType
} from './model'

import {
  decryptUserAsync
} from '../../controllers/user'

import mongoose from 'mongoose'

const User = mongoose.model('User')
const Payment = mongoose.model('Payment')

const user = {
  type: UserType,
  args: {
    code: {
      name: 'code',
      type: new GraphQLNonNull(GraphQLID)
    },
    userInfo: {
      name: 'userInfo',
      type: new GraphQLNonNull(GraphQLString)
    },
  },
  async resolve (root, params, options) {
    const code = params.code
    const userInfo = JSON.parse(decodeURIComponent(params.userInfo))
    const user = await decryptUserAsync(code, userInfo)
    const payments = await Payment.find({
      user: user._id
    }).populate('product')

    user.payments = payments

    return user
  }
}

const users = {
  type: new GraphQLList(UserType),
  args: {},
  resolve (root, params, options) {
    return User.find({}).exec()
  }
}

export default {
  user,
  users
}
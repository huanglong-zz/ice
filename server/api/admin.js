import mongoose from 'mongoose'

const User = mongoose.model('User')

export async function login(email, password) {
  let match = false

  const user = await User.findOne({ email: email }).exec()

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}

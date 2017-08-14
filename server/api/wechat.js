import mongoose from 'mongoose'
import { getWechat, getOAuth } from '../wechat'

const User = mongoose.model('User')

const client = getWechat()

export async function getSignatureAsync (url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket, url)
  params.appId = client.appID

  return params
}

export function getAuthorizeURL (...args) {
  const oauth = getOAuth()

  console.log(oauth)
  return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
  const oauth = getOAuth()
  const data = await oauth.fetchAccessToken(code)
  console.log(data)
  const user = await oauth.getUserInfo(data.access_token, data.unionid)
  console.log(user)
  // const user = await oauth.getUserInfo(data.access_token, data.openid)

  const existUser = await User.findOne({
    unionid: data.unionid
  }).exec()

  console.log('existUser')

  console.log(existUser)

  if (!existUser) {
    let newUser = new User({
      openid: [data.openid],
      unionid: data.unionid,
      nickname: user.nickname,
      province: user.province,
      country: user.country,
      city: user.city,
      headimgurl: user.headimgurl,
      sex: user.sex
    })

    await newUser.save()
  }

  return {
    nickname: user.nickname,
    province: user.province,
    country: user.country,
    city: user.city,
    headimgurl: user.headimgurl,
    sex: user.sex
  }
}



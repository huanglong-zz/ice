import { controller, get, post, required } from '../decorator/router'
import mongoose from 'mongoose'
import config from '../config'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from '../wechat-lib/mina'

const User = mongoose.model('User')

@controller('/mina')
export class MinaController {
  @get('codeAndSessionKey')
  @required({ query: ['code'] })
  async getCodeAndSessionKey (ctx, next) {
    const { code } = ctx.query
    let res = await openidAndSessionKey(code)

    ctx.body = {
      success: true,
      data: res
    }
  }

  @get('user')
  @required({ query: ['code', 'userInfo'] })
  async getUser (ctx, next) {
    const { code, userInfo } = ctx.query
    const minaUser = await openidAndSessionKey(code)

    let user = await User.findOne({
      unionid
    }).exec()

    if (!user) {
      let pc = new WXBizDataCrypt(minaUser.session_key)
      let data = pc.decryptData(userInfo.encryptedData, userInfo.iv)

      try {
        user = await User.findOne({
          unionid: data.unionId
        })

        if (!user) {
          let _userData = userInfo.userInfo

          user = new User({
            avatarUrl: _userData.avatarUrl,
            nickname: _userData.nickName,
            unionid: data.unionid,
            openid: [minaUser.openid],
            sex: _userData.gender,
            country: _userData.country,
            province: _userData.province,
            city: _userData.city
          })

          await user.save()
        }
      } catch (err) {
        return (ctx.body = {
          success: false,
          err: err
        })
      }
    }

    ctx.body = {
      success: true,
      data: {
        nickname: user.nickname,
        avatarUrl: user.avatarUrl,
        sex: user.sex
      }
    }
  }

  @post('login')
  @required({ body: ['code', 'avatarUrl', 'nickName'] })
  async login (ctx, next) {
    const {
      code,
      avatarUrl,
      nickName
    } = ctx.request.body

    try {
      const { openid, unionid } = await openidAndSessionKey(code)

      let user = await User.findOne({
        unionid
      }).exec()

      if (!user) {
        user = new User({
          openid: [openid],
          nickname: nickName,
          unionid,
          avatarUrl
        })

        user = await user.save()
      } else {
        user.avatarUrl = avatarUrl
        user.nickname = nickName
        user = await user.save()
      }

      ctx.body = {
        success: true,
        data: {
          nickname: nickname,
          avatarUrl: avatarUrl
        }
      }
    } catch (err) {
      ctx.body = {
        success: false,
        err: err
      }
    }
  }
}


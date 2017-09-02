import { parse as urlParse } from 'url'
import { parse as queryParse } from 'querystring'
import { getParamsAsync } from '../wechat-lib/pay'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from '../wechat-lib/mina'
import config from '../config'
import api from '../api'

export async function signature (ctx, next) {
  let url = ctx.query.url

  if (!url) ctx.throw(404)

  url = decodeURIComponent(url)

  const params = await api.wechat.getSignatureAsync(url)

  ctx.body = {
    success: true,
    data: params
  }
}

export async function redirect (ctx, next) {
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const { visit, id } = ctx.query
  const params = id ? `${visit}_${id}` : visit
  const url = api.wechat.getAuthorizeURL(scope, target, params)

  ctx.redirect(url)
}

export async function oauth (ctx, next) {
  let url = ctx.query.url

  url = decodeURIComponent(url)

  const urlObj = urlParse(url)
  const params = queryParse(urlObj.query)
  const code = params.code
  const user = await api.wechat.getUserByCode(code)

  ctx.session.user = user
  ctx.body = {
    success: true,
    data: user
  }
}

export async function paymentAsync (ctx, next) {
  const { body } = ctx.request

  try {
    let payment = await Payment.findOne({
      _id: body.payment._id
    }).exec()

    if (!payment) return (ctx.body = {success: false, err: '订单不存在'})

    if (String(payment.product) !== body.product._id || String(payment.user) !== body.user._id) {
      return (ctx.body = {
        success: false,
        err: '订单错误，请联系网站管理员'
      })
    }

    payment.success = 1  

    await payment.save()

    ctx.body = {success: true, msg: '支付成功'}
  } catch (err) {
    return (ctx.body = {
      success: false,
      err: err
    })
  }
}

export async function createOrderAsync (ctx, next) {
  const ip = ctx.ip.replace('::ffff:', '')
  const { code, productId, userInfo, name, address, phoneNumber } = ctx.request.body
  let product

  try {
    product = await Product.findOne({
      _id: productId
    }).exec()

    if (!product) return (ctx.body = {success: false, err: '这个宝贝不在了'})
  } catch (e) {
    return (ctx.body = {success: false, err: '服务器异常'})
  }

  try {
    const minaUser = await openidAndSessionKey(code)
    const wxBizDataCrypt = new WXBizDataCrypt(minaUser.session_key)
    const decryptData = wxBizDataCrypt.decryptData(userInfo.encryptedData, userInfo.iv)

    try {
      let user = await User.findOne({
        unionid: decryptData.unionId
      }).exec()

      if (!user) {
        let _userInfo = userInfo.userInfo

        user = new User({
          avatarUrl: _userInfo.avatarUrl,
          nickname: _userInfo.nickname,
          unionid: _userInfo.unionId,
          openid: [minaUser.openid],
          sex: _userInfo.gender,
          country: _userInfo.country,
          province: _userInfo.province,
          city: _userInfo.city
        })

        await user.save()
      }
    } catch (err) {
      return (ctx.body = {
        success: false,
        err: '用户存储失败'
      })
    }

    let _order = {
      body: product.title,
      attach: '小程序周边支付',
      out_trade_no: 'Product' + (+new Date()),
      // total_fee: product.price * 100,
      total_fee: 0.1 * 100,
      spbill_create_ip: ip,
      openid: minaUser.openid,
      trade_type: 'JSAPI'
    }

    let order = await getParamsAsync(_order)

    const payment = await api.payment.create(user, product, order, '小程序支付', {
      name,
      address,
      phoneNumber
    })

    ctx.body = {
      order,
      product,
      payment,
      user
    }
  } catch (e) {
    return (ctx.body = {
      success: false,
      err: '服务器异常'
    })
  }
}

export async function wechatPay (code) {
  const ip = ctx.ip.replace('::ffff:', '')
  const session = ctx.session
  const {
    productId,
    name,
    phoneNumber,
    address
  } = ctx.request.body

  const product = await api.product.findProduct(productId)

  if (!product) {
    return (ctx.body = {
      success: false, err: '这个宝贝不在了'
    })
  }

  try {
    let user = await api.user.findUserByUnionId(session.user.unionid).exec()

    if (!user) {
      user = await api.user.saveFromSession(session)
    }

    const orderParams = {
      body: product.title,
      attach: '公众号周边手办支付',
      out_trade_no: 'Product' + (+new Date),
      spbill_create_ip: ip,
      // total_fee: product.price * 100,
      total_fee: 0.01 * 100,
      openid: session.user.unionid,
      trade_type: 'JSAPI'
    }

    const order = await getParamsAsync(orderParams)
    const payment = await api.payment.create(user, product, order, '公众号', {
      name,
      address,
      phoneNumber
    })

    ctx.body = {
      success: true,
      data: payment.order
    }
  } catch (err) {
    ctx.body = {
      success: false,
      err: err
    }
  }
}





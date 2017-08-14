import { controller, get, post, required } from '../decorator/router'
import mongoose from 'mongoose'
import { resolve } from 'path'
import config from '../config'
import reply from '../wechat/reply'
import wechatMiddle from '../wechat-lib/middleware'
import { signature, redirect, oauth } from '../controllers/wechat'
import { getParamsAsync } from '../wechat-lib/pay'

const User = mongoose.model('User')
const Product = mongoose.model('Product')
const Payment = mongoose.model('Payment')


@controller('')
export class WechatController {
  @get('/wechat-hear')
  async wechatHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wechat-hear')
  async wechatPostHear (ctx, next) {
    const middle = wechatMiddle(config.wechat, reply)
    const body = await middle(ctx, next)

    ctx.body = body
  }

  @post('/wechat-pay')
  @required({ body: ['productId', 'name', 'phoneNumber', 'address'] })
  async createOrder (ctx, next) {
    const ip = ctx.ip.replace('::ffff:', '')
    const session = ctx.session
    const {
      productId,
      name,
      phoneNumber,
      address
    } = ctx.request.body

    const product = await Product.findOne({
      _id: product
    }).exec()

    if (!product) {
      return (ctx.body = {
        success: false, err: '这个宝贝不在了'
      })
    }

    try {
      let user = await User.findOne({
        unionid: session.user.unionid
      }).exec()

      if (!user) {
        user = new User({
          openid: [session.user.openid],
          unionid: session.user.unionid,
          nickname: session.user.nickname,
          address: session.user.address,
          province: session.user.province,
          country: session.user.country,
          city: session.user.city,
          sex: session.user.sex,
          headimgurl: session.user.headimgurl,
          avatarUrl: session.user.avatarUrl
        })

        user = await user.save()
      }

      const orderParams = {
        body: product.title,
        attach: '公众号周边手办支付',
        out_trade_no: 'Product' + (+new Date),
        spbill_create_ip: ip,
        total_fee: product.price * 100,
        openid: session.user.unionid,
        trade_type: 'JSAPI'
      }
      const order = await getParamsAsync(orderParams)

      let payment = new Payment({
        user: user._id,
        product: product._id,
        name: name,
        address: address,
        phoneNumber: phoneNumber,
        payType: '公众号',
        order: order
        totalFee: product.price
      })

      payment = await payment.save()

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

  @get('/wechat-signature')
  async wechatSignature (ctx, next) {
    await signature(ctx, next)
  }

  @get('/wechat-redirect')
  async wechatRedirect (ctx, next) {
    await redirect(ctx, next)
  }

  @get('/wechat-oauth')
  async wechatOAuth (ctx, next) {
    await oauth(ctx, next)
  }
}


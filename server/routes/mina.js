import { controller, get, post, required } from '../decorator/router'
import config from '../config'
import {
  getUserAsync,
  loginAsync
} from '../controllers/user'
import {
  openidAndSessionKey,
  WXBizDataCrypt
} from '../wechat-lib/mina'
import {
  createOrderAsync,
  paymentAsync
} from '../controllers/wechat'

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
    await getUserAsync(ctx, next)
  }

  @post('login')
  @required({ body: ['code', 'avatarUrl', 'nickName'] })
  async login (ctx, next) {
    await loginAsync(ctx, next)
  }

  @post('createOrder')
  @required({ body: ['code', 'productId', 'userInfo', 'name', 'address', 'phoneNumber']})
  async createOrder (ctx, next) {
    await createOrderAsync(ctx, next)
  }

  @post('payment')
  async createOrder (ctx, next) {
    await paymentAsync(ctx, next)
  }
}


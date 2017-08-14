import { controller, get, post, put } from '../decorator/router'
import { uptoken } from '../libs/qiniu'

@controller('/qiniu')
export class QiniuController {
  @get('token')
  async qiniuToken (ctx, next) {
    let key = ctx.query.key
    let token = uptoken(key)

    ctx.body = {
      success: true,
      data: {
        key: key,
        token: token
      }
    }
  }
}


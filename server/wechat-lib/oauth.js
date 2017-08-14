import request from 'request-promise'

const base = 'https://api.weixin.qq.com/sns/'
const api = {
  authorize: 'https://open.weixin.qq.com/connect/oauth2/authorize?',
  accessToken: base + 'oauth2/access_token?',
  userInfo: base + 'userinfo?'
}

export default class WechatOAuth {
  constructor(opts) {
    this.appID = opts.appID
    this.appSecret = opts.appSecret
  }

  async request (options) {
    options = Object.assign({}, options, {json: true})

    try {
      const response = await request(options)
      return response
    } catch (error) {
      console.error(error)
    }
  }

  getAuthorizeURL (scope = 'snsapi_base', target, state) {
    const url = `${api.authorize}appid=${this.appID}&redirect_uri=${encodeURIComponent(target)}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`

    return url
  }

  async fetchAccessToken (code) {
    const url = `${api.accessToken}appid=${this.appID}&secret=${this.appSecret}&code=${code}&grant_type=authorization_code`
    const data = await this.request({url: url})

    return data
  }

  async getUserInfo (token, openID, lang='zh_CN') {
    const url = `${api.userInfo}access_token=${token}&openid=${openID}&lang=${lang}`

    const data = await this.request({url: url})

    return data
  }
}







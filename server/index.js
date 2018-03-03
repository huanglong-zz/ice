import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import R from 'ramda'
import { resolve } from 'path'

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')

const r = path => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
const MIDDLEWARES = ['database', 'common', 'router']

import './wechat-lib'

class Server {
  constructor () {
    this.app = new Koa()
    this.useMiddleWares(this.app)(MIDDLEWARES)
  }

  useMiddleWares (app) {
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i => `${r('./middlewares')}/${i}`
    ))
  }

  async start () {
    // Instanciate nuxt.js
    const nuxt = await new Nuxt(config)
    // Build in development
    if (config.dev) {
      try {
        const builder = new Builder(nuxt)
        await builder.build()
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
        process.exit(1)
      }
    }

    this.app.use(async (ctx, next) => {
      await next()
      ctx.status = 200
      ctx.req.session = ctx.session

      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve)
        ctx.res.on('finish', resolve)
        nuxt.render(ctx.req, ctx.res, promise => {
          promise.then(resolve).catch(reject)
        })
      })

      await nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}

const app = new Server()

app.start()

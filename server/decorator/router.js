import Router from 'koa-router'
import { resolve } from 'path'
import glob from 'glob'
import R from 'ramda'
import _ from 'lodash'

export let routersMap = new Map()
export const symbolPrefix = Symbol('prefix')
export const isArray = v => _.isArray(v) ? v : [v]
export const normalizePath = path => path.startsWith('/') ? path : `/${path}`

export default class Route {
  constructor (app, apiPath) {
    this.app = app
    this.router = new Router()
    this.apiPath = apiPath
  }

  init () {
    glob.sync(resolve(this.apiPath, './*.js')).forEach(require)

    for (let [ conf, controller ] of routersMap) {
      const controllers = isArray(controller)
      let prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalizePath(prefixPath)

      const routerPath = prefixPath + conf.path

      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

export const router = conf => (target, key, desc) => {
  conf.path = normalizePath(conf.path)

  routersMap.set({
    target: target,
    ...conf
  }, target[key])
}

export const controller = path => target => target.prototype[symbolPrefix] = path

export const get = path => router({
  method: 'get',
  path: path
})

export const post = path => router({
  method: 'post',
  path: path
})

export const put = path => router({
  method: 'put',
  path: path
})

export const del = path => router({
  method: 'del',
  path: path
})

const decorate = (args, middleware) => {
  let [ target, key, descriptor ] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)

  return descriptor
}

export const convert = middleware => (...args) => decorate(args, middleware)

export const required = rules => convert(async (ctx, next) => {
  let errors = []

  const passRules = R.forEachObjIndexed(
    (value, key) => {
      errors = R.filter(i => !R.has(i, ctx.request[key]))(value)
    }
  )

  passRules(rules)

  if (errors.length) ctx.throw(412, `${errors.join(', ')} 参数缺失`)

  await next()
})


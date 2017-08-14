import Route from '../decorator/router'
import { resolve } from 'path'

const r = path => resolve(__dirname, path)

export const router = app => {
  const apiPath = r('../routes')
  const router = new Route(app, apiPath)

  router.init()
}

import _ from 'lodash'
import { resolve } from 'path'

const host = process.env.HOST || 'localhost'
const env = process.env.NODE_ENV || 'development'
const conf = require(resolve(__dirname, `./${env}.json`))

export default _.assign({
  env,
  host
}, conf)

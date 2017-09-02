import fs from 'fs'
import wechatPay from 'wechat-pay'
import config from '../config'
import path from 'path'

const cert = path.resolve(__dirname, '../', 'config/cert/apiclient_cert.p12')

const paymentConfig = {
  appId: config.shop.appId,
  partnerKey: config.shop.partnerKey,
  mchId: config.shop.mchId,
  notifyUrl: config.shop.notifyUrl,
  ptx: fs.readFileSync(cert)
}
const Payment = wechatPay.Payment
const payment = new Payment(paymentConfig || {})

export const getParamsAsync = (order) => {
  return new Promise((resolve, reject) => {
    payment.getBrandWCPayRequestParams(order, (err, payargs) => {
      if (err) reject(err)
      else resolve(payargs)
    })
  })
}


export const getPayDataAsync = (req) => {
  return new Promise((resolve, reject) => {
    let data = ''

    req.setEncoding('utf8')
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      req.rawBody = data

      resolve(data)
    })
  })
}


export const getNoticeAsync = (rawBody) => {
  return new Promise((resolve, reject) => {
    payment.validate(rawBody, (err, message) => {
      if (err) reject(err)
      else resolve(message)
    })
  })
}

export const getBillAsync = (date) => {
  return new Promise((resolve, reject) => {
    payment.downloadBill({
      bill_date: date,
      bill_type: 'ALL'
    }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

export const getOrdersAsync = (params) => {
  return new Promise((resolve, reject) => {
    payment.orderQuery(params, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}


export const buildFailXML = (err) => {
  return payment.buildXml({
    return_code: 'FAIL',
    return_msg: err.name
  })
}

export const buildSuccessXML = (err) => {
  if (err) return buildFailXML(err)

  return payment.buildXml({
    return_code: 'SUCCESS'
  })
}



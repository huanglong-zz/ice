import mongoose from 'mongoose'

const Payment = mongoose.model('Payment')

export async function fetchPayments () {
  const data = await Payment.find({}).populate('product user').exec()

  return data
}

export async function create (user, product, order, payType, body) {
  let payment = new Payment({
    user: user._id,
    product: product._id,
    name: body.name,
    address: body.address,
    phoneNumber: body.phoneNumber,
    payType: payType,
    order: order,
    totalFee: product.price
  })

  payment = await payment.save()

  return payment
}
const winston = require('winston')

const getBalance = require('./balance')
const BalanceModel = require('../models/balance')

const mqttpub = require('./mqttpub')

async function infiniteFetch() {
  try {
    const balance = await getBalance()
    winston.log('info', new Date().toString(), 'fetched balance', balance.estimations.eur)

    const model = new BalanceModel(balance)

    mqttpub.publish('balance', model.toJSON())

    model.save(error => {
      if (error) winston.log('warn', 'unable to store balance model')
      else winston.log('debug', 'balance entry saved')
    })

    setTimeout(infiniteFetch, process.env.REFRESH)
  } catch (e) {
    winston.log('error', e)
  }
}

module.exports = function() {
  infiniteFetch()
}
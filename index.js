require('dotenv').config()

const mongoose = require('mongoose')
const mqtt = require('mqtt')
const winston = require('winston')

const mqttPub = require('./lib/mqttpub')

winston.level = process.env.DEBUG_LEVEL || 'info'

function mongooseConnection() {
  mongoose.Promise = global.Promise

  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL, error => {
      if (error) {
        winston.log('error', error)
        reject(error)
      } else {
        winston.log('info', '✔ mongoose connection opened')
        resolve(mongoose)
      }

    });

  })
}

function mqttConnection() {
  const client = mqtt.connect(process.env.MQTT_URL)

  return new Promise((resolve, reject) => {

    client.once('error', error => {
      winston.log('error', error)
      reject(error)
    })

    client.once('connect', () => {
      winston.log('info', '✔ mqtt connection opened')
      resolve(client)
    })
  })
}

const deferredBootstrap = Promise.all([
  mongooseConnection(),
  mqttConnection()
])

deferredBootstrap
  .then(([ mongoose, mqttClient ]) => {

    mqttPub.client = mqttClient

    require('./lib/infinity')()
    require('./lib/server')

  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
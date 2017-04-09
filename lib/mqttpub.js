const { EventEmitter } = require('events')

const winston = require('winston')

class MqttPub extends EventEmitter {

  constructor() {
    super()

    this.__client = null
  }

  set client(_client) {
    if (this.__client !== null) throw new Error('mqtt client ever set, you cannot override current initialized instance')
    this.__client = _client
  }

  publish(topic, payload) {
    this.__client.publish(topic, JSON.stringify(payload), { qos: 1 })

    return this;
  }
}

module.exports = new MqttPub()

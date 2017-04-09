const mongoose = require('mongoose')

module.exports = mongoose.model('Balance', {
  creationDate: {
    type: Date,
    default: Date.now(),
    index: true
  },
  balance: Object,
  total: Number,
  estimations: Object
})
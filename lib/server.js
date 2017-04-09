const express = require('express')
const winston = require('winston')

const app = express()

/**
 * todo
 * - graphql wrapper 
 */

app.get('/', (req, res) => {
  res.json({ currentTime: Date.now() })
})

app.listen(process.env.PORT, err => {
  if (err) winston.log('error', err)
  else {
    winston.log('info', '✔ express server listening', process.env.PORT)
  }
})
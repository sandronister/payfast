const winston = require('winston')
const fs = require('fs')

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}


module.exports = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/payfast.log',
      maxsize: 10000000,
      maxFiles: 10
    })
  ]
})



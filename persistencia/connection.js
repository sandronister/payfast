const mysql = require('mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123',
    database:'bancolocal'
})

module.exports = conn

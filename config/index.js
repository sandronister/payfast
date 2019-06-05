const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const morgan = require('morgan')
var logger = require('../services/logger')


const app = express()

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(expressValidator())
app.use(morgan("common",{
    stream:{
        write:function(message){
           logger.info(message)
        }
    }
}))

consign()
    .include('controllers')
    .then('persistencia')
    .then('services')
    .into(app)

module.exports = app
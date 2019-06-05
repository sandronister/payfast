const app = require('./config'),
  port = process.env.PORT || 3000

app.listen(port, function () {
  console.log('Rodando na porta %d',port)
})

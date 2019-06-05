const CREATED_PAY = 'CREATED'
const CONFIM_PAY = 'CONFIRM'
const CANCEL_PAY = 'CANCELED'

module.exports = (app) => {

  app.get('/pagamentos/:id', (req, res) => {
    console.log('Busca pagamento')

    let id = req.params.id

    const conn = app.persistencia.connection
    const pagamentoDAO = new app.persistencia.paymentDAO(conn)

    const memCached = new app.services.clientMemCached()

    memCached.get('payment-' + id, function (err, result) {
      if (err || !result) {
        console.log('MISS não encontrado a chave')
        pagamentoDAO.searchId(id, function (error, result) {
          if (error) {
            console.log('Ocorreu um erro')
            res.status(500).send(error)
          }

          res.send(result)
        })
      } else {
        res.send(result)
      }
    })


  })

  app.put('/pagamentos/:id', (req, res) => {

    console.log('Confirma pagamento')
    let pagamento = {}
    pagamento.id = req.params.id
    pagamento.statuspay = CONFIM_PAY

    const conn = app.persistencia.connection
    const paymentDAO = new app.persistencia.paymentDAO(conn)

    paymentDAO.update(pagamento, function (error, result) {
      if (error) {
        res.status(400).send(error)
      } else {
        res.status(200).json(pagamento)
      }
    })
  })

  app.delete('/pagamentos/:id', (req, res) => {

    let pagamento = {}
    pagamento.id = req.params.id
    pagamento.statuspay = CANCEL_PAY

    const conn = app.persistencia.connection
    const paymentDAO = new app.persistencia.paymentDAO(conn)

    paymentDAO.update(pagamento, function (error, result) {
      if (error) {
        res.status(400).send(error)
      } else {
        res.status(204).json(pagamento)
      }
    })
  })

  app.post('/pagamentos', (req, res) => {
    req.assert('payment.paytype', 'É obrigatório a forma de pagamento').notEmpty()
    req.assert('payment.value', 'Eh obrigatorio e deve ser decimal').notEmpty().isFloat()
    req.assert('payment.coin', 'Moeda é obrigatória e deve conteer até 3 caracteres').notEmpty().len(3, 3)

    const errors = req.validationErrors()

    if (errors) {
      res.status(400).send(errors)
      return
    }


    let payment = req.body['payment']
    payment.paystatus = CREATED_PAY
    payment.paydate = new Date

    const conn = app.persistencia.connection
    const paymentDAO = new app.persistencia.paymentDAO(conn)

    const memCached = new app.services.clientMemCached()
    console.log(memCached)

    if (payment.paytype == 'cartao') {
      const card = req.body['card']
      let ClientCard = new app.services.clientCard()

      ClientCard.autorize(card, function (result, response) {
        payment.cardstatus = result.dados_do_cartao.status

        paymentDAO.save(payment, function (erro, result) {
          if (erro) {
            res.status(400).send(erro)
          }

          payment.id = result.insertId

          memCached.set('payment-' + payment.id, payment, 6000, function (err, result) {
            if (err) {
              console.log('Ocorreu um erro ao inserir no memcached')
            } else {
              console.log('Inserido com sucesso no memcached')
            }

          })

          let jsonret = {
            paymentData: payment,
            card: card,
            links: [
              {
                href: 'http://localhost:5000/pagamentos/' + payment.id,
                rel: 'Confirm',
                method: 'PUT'
              },
              {
                href: 'http://localhost:5000/pagamentos/' + payment.id,
                rel: 'Cancel',
                method: 'DELETE'
              }
            ]
          }

          res.status(201).json(jsonret)
        })
      })

    } else {
      paymentDAO.save(payment, function (erro, result) {
        if (erro) {
          res.status(400).send(erro)
        }

        payment.id = result.insertId

        let jsonret = {
          paymentData: payment,
          links: [
            {
              href: 'http://localhost:5000/pagamentos/' + payment.id,
              rel: 'Confirm',
              method: 'PUT'
            },
            {
              href: 'http://localhost:5000/pagamentos/' + payment.id,
              rel: 'Cancel',
              method: 'DELETE'
            }
          ]
        }

        res.status(201).json(jsonret)
      })
    }
  })
}
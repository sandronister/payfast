const soap = require('soap')

function clientCorreios(){
    this._url='http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL'
}

clientCorreios.prototype.calcPrazo = function(args,callback){
    soap.createClient(this._url,function(error,client){
        console.log('Criado cliente com sucesso')
        client.CalcPrazo(args,callback)
    })
}


module.exports = function(){
    return clientCorreios
}
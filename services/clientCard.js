const Client = require('node-rest-client').Client;

function clientCard(){
    this._client = new Client()
    this._client.registerMethod('auto','http://localhost:3001/cartoes/autoriza','POST')
}

clientCard.prototype.autorize = function(card,callback){
    
    let args ={
        data:{card},
        headers: { "Content-Type": "application/json" }
    }
    this._client.methods.auto(args,callback)
}


module.exports = function(){
    return clientCard
}



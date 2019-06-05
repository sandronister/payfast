function paymentDAO(connection){
    this._connection = connection;
}

paymentDAO.prototype.save = function(payment,callback){
    this._connection.query('INSERT INTO payment set ?',payment,callback);
}

paymentDAO.prototype.list = function(callback){
   this._connection.query('SELECT * FROM payment',callback);
}

paymentDAO.prototype.update = function(payment,callback){
    this._connection.query('UPDATE payment set statuspay=? WHERE id=?',[payment.statuspay,payment.id],callback)
}

paymentDAO.prototype.searchId = function(id,callback){
    this._connection.query('SELECT * FROM payment WHERE id=?',[id],callback)
}

module.exports = function(){
    return paymentDAO
}
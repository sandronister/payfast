module.exports = (app)=>{

    app.post('/correios/calcula-prazo',(req,res)=>{
        
        let deliveryData = req.body
        
        const correiosDelivery = new app.services.clientCorreios()

        correiosDelivery.calcPrazo(deliveryData,(error,result)=>{
            
            if(error){
                res.status(500).send(error)
                return
            }

            console.log('Calculado o prazo')

            res.json(result)
        })
    })
}
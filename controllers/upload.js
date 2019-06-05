const fs = require('fs')

module.exports = (app)=> {

    app.post('/upload/imagem',(req,res)=>{

        let filename = req.headers.filename
        console.log('Recebendo imagem', filename)

        req.pipe(fs.createWriteStream('files/'+filename))
            .on('finish',()=>{
                console.log('Escrita finalizada')

                res.status(201).send('Escrita OK')
            })
    })
}

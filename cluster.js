const cluster = require('cluster')
const os = require('os')

const cpus = os.cpus()

console.log('Criando cluster')


if (cluster.isMaster) {
  
  cpus.forEach((item,index) => {
    cluster.fork();
  })


  cluster.on('listening',worker=>{
    console.log('Cluster no PID %d',worker.process.pid)
  })

  cluster.on('exit',worker=>{
    console.log('O processo %d foi morto',worker.process.pid)
    cluster.fork()
  })
  
}else{
  require('./index')
}
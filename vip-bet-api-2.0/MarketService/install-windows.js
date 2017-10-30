var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'VB: Market Service',
  description: 'Vip-Bet Market Service',
  script: 'C:\\projects\\WinningSolutions\\vb-2.0\\MarketService\\src\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
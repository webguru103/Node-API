var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'VB: Event Market Service',
  description: 'Vip-Bet Event Market Service',
  script: 'C:\\projects\\WinningSolutions\\vb-2.0\\EventMarketService\\src\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
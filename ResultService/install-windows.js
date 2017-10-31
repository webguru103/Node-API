var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'VB: Category Service',
  description: 'Vip-Bet Category Service ',
  script: 'C:\\projects\\WinningSolutions\\vb-2.0\\CategoryService\\src\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
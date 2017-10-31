var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'VB: Feed Sports888 Parser',
  description: 'Vip-Bet Feed Sports888 Parser',
  script: 'C:\\projects\\WinningSolutions\\vb-2.0\\parsers\\Sports888Parser\\src\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
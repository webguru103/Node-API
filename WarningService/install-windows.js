var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'VB: Warning Service',
  description: 'Vip-Bet Warning Service',
  script: 'C:\\projects\\WinningSolutions\\vb-2.0\\WarningService\\src\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
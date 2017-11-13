(function () {
  'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const os = require('os');
const cluster = require('cluster');
// const compression = require('compression');
//fetch port number from the environment variables
const portNumber = 4200;
function initializeDevServer() {
    const app = express();
    // app.use(compression());
    app.set('views', path.join(__dirname, 'dist'));
    console.log(path.join(__dirname, 'dist'));
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({extended: false}));

    app.use( (req, res, next) => {
        console.log('serving => ' + path.basename(req.url));
        next();
    });

    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/dist/index.html'));
    });

    app.listen(portNumber, () => {
        console.log('server listening at '+portNumber);
    });
}

if (cluster.isMaster) {
  var cpuNum = os.cpus().length;

for (var i =0; i< cpuNum; i++) {
  cluster.fork();
}

cluster.on('online', function(worker) {
  console.log('Worker ' + worker.process.pid + ' is online');
});

cluster.on('exit', function(worker, code, signal) {
  console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
  console.log('Starting a new worker');
  cluster.fork();
});
} else {
  initializeDevServer();
}


})();
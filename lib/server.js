var http = require ('http');
var job = require('./job.js');

exports.boot = function() {
  http.createServer(handleRequest).listen(9000);
}

function handleRequest(req, res) {
  if (req.method == "GET") {
    handleGet(req, res);
  } else if (req.method == "POST") {
    handlePost(req, res);
  } else {
    sendNotImplemented(res);
  }
}

function handleGet(req, res) {
  sendNotImplemented(res);
}

function handlePost(req, res) {
  sendNotImplemented(res);
}

function sendNotImplemented(res) {
  res.writeHead(501, {'Content-Type': 'text/plain'} )
  res.end("Not Implemented");
}

function foo() {
  console.log('foo');
}
var http = require ('http');
var job = require('./job.js');

var jobs = [];

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
  storeJob(job.spawn('sleep', '10', done));
  sendAccepted(res);
}

function sendNotImplemented(res) {
  res.writeHead(501, {'Content-Type': 'text/plain'} );
  res.end("Not Implemented");
}

function sendAccepted(res) {
  res.writeHead(202, {'Content-Type': 'text/plain'} );
  res.end("Accepted");
}

function done(err, result) {
  // POST back results
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
}

function storeJob(job) {
  jobs.push(job);
}

function retrieveJob(id) {
  var result = jobs.filter(function(job) { job.id == id; });
  return (result.length > 0 ? result[0] : null);
}
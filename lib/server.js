var http = require('http'),
    url  = require('url'),
    job  = require('./job.js');

var jobs = [];

exports.boot = function() {
  http.createServer(handleRequest).listen(9000);
}

function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url);
  if (req.method == "GET" && parsedUrl.pathname.match(/^\/([0-9a-f]){40}(\/)?$/)) {
    // GET /:id
    handleGet(req, res);
  } else if (req.method == "POST" && parsedUrl.pathname == "/") {
    // POST /
    handlePost(req, res);
  } else {
    sendNotImplemented(res);
  }
}

function handleGet(req, res) {
  var id = url.parse(req.url).pathname.replace('/', '');
  var retrievedJob = retrieveJob(id);
  if (retrievedJob) {
    sendJob(res, retrievedJob);
  } else {
    sendNotFound(res);
  }
}

function handlePost(req, res) {
  var storedJob = storeJob(job.spawn('sleep', '10', done));
  sendAccepted(res, storedJob);
}

function sendNotImplemented(res) {
  res.writeHead(501, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: "Not Implemented"}));  
}

function sendAccepted(res, job) {
  res.writeHead(202, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(job));
}

function sendJob(res, job) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(job));
}

function sendNotFound(res) {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: "Not Found"}));  
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
  return job;
}

function retrieveJob(id) {
  var result = jobs.filter(function(job) { return job.id == id; });
  return (result.length > 0 ? result[0] : null);
}
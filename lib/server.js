var http = require('http'),
    url  = require('url'),
    job  = require('./job.js'),
    argv = require('optimist').argv;

var jobs = [];
var whitelist = null;
var maxSizeJobList = null;

exports.boot = function() {
  initWhitelist();
  maxSizeJobList = getMaxSizeJobList();
  http.createServer(handleRequest).listen(getPort(), getHostname());
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
  var postedData = '';
  req.on('data', function(data) { postedData += data.toString(); });
  req.on('end', function() {
    try {
      var obj = JSON.parse(postedData);
      if (whitelist && whitelist.indexOf(obj.command) == -1) {
        throw new Error("Specified command is not in whitelist.");
      }
      var storedJob = storeJob(job.spawn(obj.command, obj.args, obj.callback, done));
      sendAccepted(res, storedJob);
    } catch(e) {
      sendBadRequest(res, e);
    }
  })
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

function sendBadRequest(res, e) {
  res.writeHead(400, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: "Bad Request", error: e.message }));  
}

function sendNotFound(res) {
  res.writeHead(404, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ message: "Not Found"}));  
}

function done(err, result) {
  if (result) result.err = (err ? err : null);
  
  if (result && result.callback) {
    var notificationTimestamp = new Date().getTime();
    var obj = url.parse(result.callback);
    var data = JSON.stringify(result);
    var urlOpts = {
      method: 'POST',
      port: obj.port,
      host: obj.hostname,
      path: [obj.pathname, obj.search].join(''),
      headers: { 'Content-Type': 'application/json',
                 'Accept': 'application/json',
                 'Content-Length': data.length,
                 'X-Notify-Timestamp': notificationTimestamp
               }
    };

  var req = http.request(urlOpts, function(res) { /* success */ })
              .on('error', function(err) { /* error */ });
    req.write(data);
    req.end();
  }
}

function storeJob(job) {
  jobs.push(job);
  if (jobs.length > maxSizeJobList) jobs.shift(); // Remove first job if max size is exceeded
  return job;
}

function retrieveJob(id) {
  var result = jobs.filter(function(job) { return job.id == id; });
  return (result.length > 0 ? result[0] : null);
}

function getPort() {
  var port = argv.p || 9000;
  return (isNaN(port) ? 9000 : port);
}

function getHostname() {
  var interface = argv.i || '127.0.0.1';
  return interface;
}

function getMaxSizeJobList() {
  var size = argv.n || 100;
  return (isNaN(size) ? 100 : size);
}

function initWhitelist() {
  var commands = argv.w;
  if (argv.w) whitelist = argv.w.split(',');
}
var http = require ('http');

exports.boot = function() {
  http.createServer(handleRequest).listen(9000);
}

handleRequest = function(req, res) {
  if (req.method == "GET") {
    handleGet(req, res);
  } else if (req.method == "POST") {
    handlePost(req, res);
  } else {
    sendNotImplemented(res);
  }
}

handleGet = function(req, res) {
  sendNotImplemented(res);
}

handlePost = function(req, res) {
  sendNotImplemented(res);
}

sendNotImplemented = function(res) {
  res.writeHead(501, {'Content-Type': 'text/plain'} )
  res.end("Not Implemented");
}
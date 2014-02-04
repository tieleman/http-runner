var childProcess = require('child_process'),
    crypto        = require('crypto');

exports.spawn = function(process, args, callback) {
  var argsArray = args.replace(/\s+/g, " ").split(' ');
  var theProcess = childProcess.spawn(process, argsArray);          
  var job = { stderr: '', stdout: '', id: generateId(), code: null, command: process, arguments: argsArray };
  var internalJob = { job: job, error: null, callback: callback, process: theProcess };
  
  theProcess.stdout.on('data', function(data) {         processData.call(internalJob, 'stdout', data); });
  theProcess.stderr.on('data', function(data) {         processData.call(internalJob, 'stderr', data); });
  theProcess.on('error',       function(err) {          processError.call(internalJob, err);           });
  theProcess.on('close',       function(code, signal) { processClose.call(internalJob, code, signal);  });
  
  return job;
}

function processData(stream, data) {
  this.job[stream] += data.toString();
}

function processError(err) {
  this.error = err;
}

function processClose(code, signal) {
  this.job.code = code;
  this.callback(this.error, this.job);
}

function generateId() {
  var hash = crypto.createHash('sha1');
  hash.update([new Date(), Math.random()].join(''));

  return hash.digest('hex');
}
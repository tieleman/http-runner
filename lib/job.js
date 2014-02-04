var child_process = require('child_process');

exports.spawn = function(process, args, callback) {
  var the_process = child_process.spawn(process, args);          

  the_process.stdout.on('data', placeholder)
  the_process.stderr.on('data', placeholder);
  the_process.on('error', placeholder);
  the_process.on('close', placeholder);
  
  return the_process;
}

function placeholder() {
  
}
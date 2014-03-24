# http-runner

A simple HTTP-based remote job runner using Node.js.


## Description

`http-runner` allows you to remotely create shell jobs using a small HTTP JSON
API. Basically, you send an HTTP POST with a JSON object containing a `command` and an `arguments` string and it will spawn a process.

`stdout` and `stderr` output, the process exit code and any error message will be captured and returned.

This package allows you to execute long-running processes (e.g. transcoding, archival tasks, etc.) asynchronously and be notified when a job is done. Also, it allows you to trigger jobs on separate machines on your network to spread load.

## API

* * *
Request: `POST /`

Parameters (HTTP POST data, should be valid JSON object):

    {
        "command": "curl",
        "args":"--progress-bar https://raw.github.com/tieleman/http-runner/master/LICENSE",
        "callback":"http://my.callback.io:8080/"
    }

`callback` is an optional argument. It is a HTTP endpoint that should be notified when the job completes. The job and any error status will be POSTed to this endpoint. This will silently fail if the callback is not available (i.e. `http-runner` doesn't care whether the other end is available or not).

Responses:

* `202 Accepted` - Job accepted
* `400 Bad Request` - Invalid request (format)

* * *
Request: `GET /:id`

Responses:

* `200 OK` - Returns status of job
* `404 Not Found` - Job not found


## Warning

`http-runner` is of course an easy way to have anyone compromise your system. Don't run this public on the internet. It will kill your dog, eat your dinner, break your porselain collection and sell the nuclear launch codes to evil dictators.

Don't ever run this as root, run it as an unprivileged user, and even then, use extreme caution (don't say I didn't warn you).

If at all possible use a small whitelist (and don't put `sudo` in your whitelist).

## Running http-runner

* Clone the source from Github (or install from npm using `npm install http-runner`).
* Run `npm install` from the source directory to install dependencies if cloned from Github (not necessary when installed using npm).
* Run `bin/http-runner`, this will start the server on port 9000, listening on the loopback interface only (so no remote connections can be made unless you explicitly allow it).

The CLI supports the following options:

    -p $PORT: run server on specified TCP port (default 9000)
    -i $INTERFACE: accept connections on the specified interface (default 127.0.0.1)
    -w $WHITELIST: only allow specific commands (comma-separated, default all commands)
    -n $MAX_JOB_COUNT: maximum number of jobs to keep in memory (default 100)

## Examples

Creating a job:

    # curl -XPOST -d'{"command":"echo", "args":"foo"}' http://localhost:9000
    {"stderr":"","stdout":"","id":"9c2ec44b891317c272c0e20d1e46629a83ebf905","code":null,"command":"echo","arguments":["foo"]}

Getting the status of a job:

    # curl http://localhost:9000/9c2ec44b891317c272c0e20d1e46629a83ebf905
    {"stderr":"","stdout":"foo\n","id":"9c2ec44b891317c272c0e20d1e46629a83ebf905","code":0,"command":"echo","arguments":["foo"],"err":null}

Note that after the job has completed the exit code has been set (in this case to `0`). Also, if any errors occurred during the spawning of the job (e.g. Node can't spawn for whatever reason) this will be visible in the `err` property.

Starting `http-runner` with CLI options (port 8080, whitelist of two commands: `ffmpeg` and `rake`):

    # http-runner -p 8080 -w /usr/local/bin/ffmpeg,/usr/local/bin/rake

Note that the comma-separated list should not contain spaces (not fully tested) and jobs should match the commands listed here *exactly*.

The `-n` option allows specifying the maximum number of jobs to keep in memory. Creating a job after the maximum has been reached will result in the purging of the oldest jobs from memory, to prevent memory overflow issues.
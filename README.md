# http-runner

A simple HTTP-based remote job runner using Node.js.


## Description

`http-runner` allows you to remotely create shell jobs using a small HTTP JSON
API. Basically, you send an HTTP POST with a JSON object containing a `command` and an `arguments` string and it will spawn a process.

`stdout` and `stderr` output, the process exit code and any error message will be captured and returned.

This package allows you to execute long-running processes (e.g. transcoding, archival tasks, etc.) asynchronously and (in the future) be notified when a job is done. Also, it allows you to trigger jobs on separate machines on your network to spread load.

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

## Running http-runner

* Clone the source from Github (or install from npm using `npm install http-runner`).
* Run `npm install` from the source directory to install dependencies if cloned from Github (not necessary when installed using npm).
* Run `bin/http-runner`, this will start the server on port 9000.

The CLI supports the following options:

    -p $PORT: run server on specified TCP port (default 9000)

## TODO

* Add whitelisting capabilities to only allow specific commands.
* Allow purging of old jobs to prevent memory issues.
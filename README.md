# http-runner

A simple HTTP-based remote job runner using Node.js.


## Description

`http-runner` allows you to remotely create shell jobs using a small HTTP JSON
API. Basically, you send an HTTP POST with a JSON object containing a `command` and an `arguments` string and it will spawn a process.

`stdout` and `stderr` output, the process exit code and any error message will be captured and returned.

This package allows you to execute long-running processes (e.g. transcoding, archival tasks, etc.) asynchronously and (in the future) be notified when a job is done.

## API

* * *
Request: `POST /`

Parameters (HTTP POST data, should be valid JSON object):

    {
        "command": "curl",
        "args":"--progress-bar https://raw.github.com/tieleman/http-runner/master/LICENSE"
    }

Responses:

* `202 Accepted` - Job accepted
* `400 Bad Request` - Invalid request (format)

* * *
Request: `GET /:id`

Responses:

* `200 OK` - Returns status of job
* `404 Not Found` - Job not found


## Warning

`http-runner` is of course an easy way to have anyone root your system. Don't run this public on the internet. It will kill your dog, eat your dinner, break your porselain collection and sell the nuclear launch codes to evil dictators.

Don't run this as root, run it as an unprivileged user.

## TODO

* Add whitelisting capabilities to only allow specific commands.
* Add `callback` option to send a HTTP notification whenever a job completes or fails.
* Allow purging of old jobs to prevent memory issues.
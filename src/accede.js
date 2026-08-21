
import fetch from 'node-fetch';

const response = await fetch('https://github.com/');
const body = await response.text();

console.log(body);

import fetch from 'node-fetch';

const response = await fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
const data = await response.json();

console.log(data);

import fetch from 'node-fetch';

const body = {a: 1};

const response = await fetch('https://httpbin.org/post', {
	method: 'post',
	body: JSON.stringify(body),
	headers: {'Content-Type': 'application/json'}
});
const data = await response.json();

console.log(data);

import fetch from 'node-fetch';

const params = new URLSearchParams();
params.append('a', 1);

const response = await fetch('https://httpbin.org/post', {method: 'POST', body: params});
const data = await response.json();

console.log(data);

Handling exceptions
NOTE: 3xx-5xx responses are NOT exceptions, and should be handled in then(), see the next section.

Wrapping the fetch function into a try/catch block will catch all exceptions, such as errors originating from node core libraries, like network errors, and operational errors which are instances of FetchError. See the error handling document for more details.

import fetch from 'node-fetch';

try {
	await fetch('https://domain.invalid/');
} catch (error) {
	console.log(error);
}

Handling client and server errors
It is common to create a helper function to check that the response contains no client (4xx) or server (5xx) error responses:

import fetch from 'node-fetch';

class HTTPResponseError extends Error {
	constructor(response, ...args) {
		super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
		this.response = response;
	}
}

const checkStatus = response => {
	if (response.ok) {
		// response.status >= 200 && response.status < 300
		return response;
	} else {
		throw new HTTPResponseError(response);
	}
}

const response = await fetch('https://httpbin.org/status/400');

try {
	checkStatus(response);
} catch (error) {
	console.error(error);

	const errorBody = await error.response.text();
	console.error(`Error body: ${errorBody}`);
}

Handling cookies
Cookies are not stored by default. However, cookies can be extracted and passed by manipulating request and response headers. See Extract Set-Cookie Header for details.

Advanced Usage
Streams
The "Node.js way" is to use streams when possible. You can pipe res.body to another stream. This example uses stream.pipeline to attach stream error handlers and wait for the download to complete.

import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import fetch from 'node-fetch';

const streamPipeline = promisify(pipeline);

const response = await fetch('https://github.githubassets.com/images/modules/logos_page/Octocat.png');

if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

await streamPipeline(response.body, createWriteStream('./octocat.png'));

Accessing Headers and other Metadata
import fetch from 'node-fetch';

const response = await fetch('https://github.com/');

console.log(response.ok);
console.log(response.status);
console.log(response.statusText);
console.log(response.headers.raw());
console.log(response.headers.get('content-type'));

Extract Set-Cookie Header
Unlike browsers, you can access raw Set-Cookie headers manually using Headers.raw(). This is a node-fetch only API.

import fetch from 'node-fetch';

const response = await fetch('https://example.com');

// Returns an array of values, instead of a string of comma-separated values
console.log(response.headers.raw()['set-cookie']);
Post data using a file
import fetch {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
} from 'node-fetch'

const mimetype = 'text/plain'
const blob = fileFromSync('./input.txt', mimetype)
const url = 'https://httpbin.org/post'

const response = await fetch(url, { method: 'POST', body: blob })
const data = await response.json()

console.log(data)
node-fetch comes with a spec-compliant FormData implementations for posting multipart/form-data payloads

import fetch, { FormData, File, fileFrom } from 'node-fetch'

const httpbin = 'https://httpbin.org/post'
const formData = new FormData()
const binary = new Uint8Array([ 97, 98, 99 ])
const abc = new File([binary], 'abc.txt', { type: 'text/plain' })

formData.set('greeting', 'Hello, world!')
formData.set('file-upload', abc, 'new name.txt')

const response = await fetch(httpbin, { method: 'POST', body: formData })
const data = await response.json()

console.log(data)

Request cancellation with AbortSignal
You may cancel requests with AbortController. A suggested implementation is abort-controller.

An example of timing out a request after 150ms could be achieved as the following:

import fetch, { AbortError } from 'node-fetch';

// AbortController was added in node v14.17.0 globally
const AbortController = globalThis.AbortController || await import('abort-controller')

const controller = new AbortController();
const timeout = setTimeout(() => {
	controller.abort();
}, 150);

try {
	const response = await fetch('https://example.com', {signal: controller.signal});
	const data = await response.json();
} catch (error) {
	if (error instanceof AbortError) {
		console.log('request was aborted');
	}
} finally {
	clearTimeout(timeout);
}
/*

index.js: snippet-kibana

The MIT License (MIT)

Copyright (c) 2014 Tristan Slominski

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

"use strict";

var events = require('events');
var http = require('http');
var path = require('path');
var staticServer = require('node-static');
var util = require('util');

var KIBANA_HOME = path.normalize(path.join(__dirname, 'kibana-3.1.0'));

/*
  * `options`:
    * `hostname`: _String_ _(Default: localhost)_
    * `port`: _Number_ _(Default: 8080)_
*/
var SnippetKibana = module.exports = function SnippetKibana(options) {
    var self = this;
    events.EventEmitter.call(self);

    options = options || {};

    self.kibana = new staticServer.Server(KIBANA_HOME);

    self.hostname = options.hostname || 'localhost';
    self.port = options.port || 8080;
    self.server = null;
};

util.inherits(SnippetKibana, events.EventEmitter);

SnippetKibana.listen = function listen(options, callback) {
    var snippetKibana = new SnippetKibana(options);
    snippetKibana.listen(callback);
    return snippetKibana;
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function (code) {}` Optional
      callback to call once the Kibana server is stopped.
*/
SnippetKibana.prototype.close = function close(callback) {
    var self = this;

    self.server ? self.server.close(callback) : undefined;
};

/*
  * `callback`: _Function_ _(Default: undefined)_ `function () {}` Optional
      callback to call once the Kibana server is started.
*/
SnippetKibana.prototype.listen = function listen(callback) {
    var self = this;

    self.server = http.createServer(function (req, res) {
        self.kibana.serve(req, res);
    });
    self.server.listen(self.port, self.hostname, function () {
        self.emit('listening', self.hostname, self.port);
        callback ? callback() : undefined;
    });
};
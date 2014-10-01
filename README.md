digger-http
===========

A HTTP transport for digger requests.

## installation

```
$ npm install digger-http
```

## example

```js
var Client = require('digger-client');
var Server = require('digger-server');
var diggerhttp = require('digger-http')

var http = require('http')
var through = require('through2');

var server = Server();
var client = Client();

var clienthandler = diggerhttp.client('http://localhost:8080')
var serverhandler = diggerhttp.server(server.reception.bind(server))

client.on('request', clienthandler)
var httpserver = http.createServer(serverhandler)

server.use(function(req, res){
  return through.obj(function(chunk, env, cb){

    chunk._digger.tag.should.equal('folder')
    chunk._digger.path.should.equal('/apples')
    chunk._digger.class.length.should.equal(1)
    chunk._digger.class[0].should.equal('red')
    this.push({
      name:'test'
    })
    cb()
  })
})

var httpserver.listen(8080, done)
```
## licence
MIT
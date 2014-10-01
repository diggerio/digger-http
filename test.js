var Client = require('digger-client');
var Server = require('digger-server');
var diggerhttp = require('./')

var http = require('http')
var through = require('through2');

describe('diggerhttp', function(){

	var server
	var client
	var clienthandler
	var serverhandler
	var httpserver

	before(function(done){

		server = Server();
    client = Client();

    clienthandler = diggerhttp.client('http://127.0.0.1:8080')
    serverhandler = diggerhttp.server(server.reception.bind(server))

    client.on('request', clienthandler)
    httpserver = http.createServer(serverhandler)

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

    httpserver.listen(8080, done)
	})

	after(function(done){
		httpserver.close(done)
	})

	it('should do a request over http', function(done) {
		
    var warehouse = client.connect('/apples');

    var data = client.create('folder').addClass('red');

    warehouse.append(data).ship(function(answers){

      var models = answers.models

      models.length.should.equal(1)
      models[0].name.should.equal('test')

      done();
      
    })
    
	})

})

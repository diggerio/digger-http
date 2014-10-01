var hyperquest = require('hyperquest')
var ndjson = require('ndjson')
var url = require('url')

module.exports = {
	server:function(handler){
		return function(req, res){
			var diggerReq = ndjson.parse()
			var diggerRes = ndjson.stringify()
			var parsedurl = url.parse(req.url)

			diggerReq.url = parsedurl.pathname
			diggerReq.query = parsedurl.query
			diggerReq.method = req.method.toLowerCase()
			diggerReq.headers = req.headers

			req.pipe(diggerReq)
			diggerRes.pipe(res)

			handler(diggerReq, diggerRes)
		}
	},
	client:function(baseurl){
		return function(diggerReq, diggerRes){

			var req = hyperquest(baseurl + diggerReq.url, {
				method:diggerReq.method.toUpperCase(),
				headers:diggerReq.headers
			})

			diggerReq
				.pipe(ndjson.stringify())
				.pipe(req)
				.pipe(ndjson.parse())
				.pipe(diggerRes)
		}
	}
}
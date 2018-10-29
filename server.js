var express = require('express');
var bodyParser = require('body-parser')
const Docker = require('node-docker-api').Docker,
 tar = require('tar-fs')

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
   res.sendFile('index.html',{ root : __dirname});
})

app.post('/send', function (req, res) {
	const docker = new Docker({ socketPath: 'tcp://192.168.99.100:2376' });
	var tarStream = tar.pack('./dockerfile')
	docker.image.build(tarStream, {
	  t: 'testimg'
	})
	  .then((stream) => promisifyStream(stream))
	  .then(() => docker.image.get('testimg').status())
  	  .catch((error) => console.log(error))
   res.send(req.body);
})

var server 	= app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
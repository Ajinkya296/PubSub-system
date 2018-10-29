var express = require('express');
var bodyParser = require('body-parser')
//const Docker = require('node-docker-api').Docker
var Docker = require('dockerode');
 tar = require('tar-fs')
var fs = require('fs');
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', function (req, res) {
   res.sendFile('index.html',{ root : __dirname});
})

app.post('/send', function (req, res) {
	const BASE_PATH = "C:/Users/ajink/.docker/machine/machines/default/";
	var docker = new Docker({
	  protocol: 'https', //you can enforce a protocol
	  host: '192.168.99.100',
	  port: 2376,
	  ca: fs.readFileSync(BASE_PATH + 'ca.pem'),
      cert: fs.readFileSync(BASE_PATH + 'cert.pem'),
      key: fs.readFileSync(BASE_PATH + 'key.pem'),
	});
	/*let stream = await docker.buildImage({
	 context: __dirname,
	 src: ['Dockerfile']
	}, 
	{t: "pytest-img"}, function (err, response) {
	  	console.log("\n++")
	  	console.log(err)
		});
	await new Promise((resolve, reject) => {
  	dockerode.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
*/
  	docker.run('pytest-img', process.stdout, function (err, data, container) {
  		console.log(err)
	 	console.log(container);
	 	res.send(container)
		});

	/*
	
    docker = new Docker({
        host: '192.168.99.100',
        protocol: 'https',
        ca: fs.readFileSync(BASE_PATH + 'ca.pem'),
        cert: fs.readFileSync(BASE_PATH + 'cert.pem'),
        key: fs.readFileSync(BASE_PATH + 'key.pem'),
        port: 2376
    });
    var readStream = fs.createReadStream('D:/Academics/Fall 2018/DS/Project 2/phase1/templates/PubSub-system/Dockerfile');
	var tarStream = tar.pack('D:/Academics/Fall 2018/DS/Project 2/phase1/templates/PubSub-system/Dockerfile')
	docker.image.build(readStream, {
	  t: 'testimg'
	})
	  .then(() => docker.image.get('testimg').status())
  	  .catch((error) => console.log(error))
   */
})

var server 	= app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
var express = require('express');
var bodyParser = require('body-parser')
var Docker = require('dockerode');
 tar = require('tar-fs')
var fs = require('fs');
var app = express();
var Writable = require('stream').Writable;


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

	var myStream = new Writable();
    var output = ''

    myStream._write = function write(doc, encoding, next) {
      var StringDecoder = require('string_decoder').StringDecoder;
      var decoder = new StringDecoder('utf8');
      var result = decoder.write(doc);
      output += result;
      next()
      // resolve(result);  // Moved the resolve to the handler, which fires at the end of the stream
    };

    function handler(error, data, container) {
      if (error) {
        console.log({ 'status': 'error', 'message': error });
      }
      console.log("\n"+output)
      res.send(output)
    };

    file_to_run = req.body.filename
    console.log(file_to_run)
  	docker.run('pytest-img',[ "python", "./"+file_to_run ], myStream, {}, handler)

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
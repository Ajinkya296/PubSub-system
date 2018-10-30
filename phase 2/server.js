var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));


class Subscription
{
	hashMap = {}

	/* Insert new subscriber in list for a topic
	*/
	add(topic,subscriber)
	{
		subscriber_list = hashMap[topic]
		subscriber_list.push(subscriber)
		hashMap[topic]  = subscriber_list
	}

	remove(topic,subscriber)
	{
		subscriber_list = hashMap[topic]
		// remove subscriber
		subscriber_list.splice(subscriber_list.indexOf(subscriber),1)
		hashMap[topic]  = subscriber_list 
	}


}

subscriptions =  new Subscription()

app.get('/', function (req, res) {
   res.sendFile('index.html',{ root : __dirname});
})

app.get('/publish', function (req, res) {
   
   publisher_id	= req.body.publisher_id
   topic_name 	= req.body.topic
   message    	= req.body.message



})

app.get('/subscribe', function (req, res) {
   
   subscriber_id	= req.body.subscriber_id
   topic_name 		= req.body.topic

   subscriptions.add(topic_name,subscriber_id)
})

app.get('/unsubscribe', function (req, res) {
   
   subscriber_id	= req.body.subscriber_id
   topic_name 		= req.body.topic

   subscriptions.remove(topic_name,subscriber_id)
})


var server 	= app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
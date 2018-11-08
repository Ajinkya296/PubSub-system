var express = require('express');
var bodyParser = require('body-parser')

const WebSocket = require('ws')
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));


const UI_socket 	= new WebSocket.Server({host: "localhost", port:3000 });

const serverSocket 	= new WebSocket.Server({host: "localhost", port:4000 });

console.log("WebSocket server listening at " + "localhost" + ":" + 3000)

console.log("UI WebSocket server listening at " + "localhost" + ":" + 4000)
class Subscription
{
	/* Insert new subscriber in list for a topic
	*/
	constructor(){
    	this.hashMap = {}
	}

	add(topic,subscriber)
	{
		if(this.hashMap[topic] != undefined) {
			if(!(this.hashMap[topic].includes(subscriber)))
			{
				this.hashMap[topic].push(subscriber)
			}
		}
		else
		{
			console.log("creating subscriber list for " +  topic)
			this.hashMap[topic] = [subscriber]
		}
		console.log(this.hashMap)
	}

	remove(topic,subscriber)
	{
		subscriber_list = this.hashMap[topic]
		// remove subscriber
		subscriber_list.splice(subscriber_list.indexOf(subscriber),1)
		this.hashMap[topic]  = subscriber_list 
	}

	get_subscribers(topic)
	{
		return this.hashMap[topic]
	}
}

class EventQueues
{
	constructor(){
    	this.hashMap = {}
	}
	/* Insert new event in list for a topic
	*/
	add(topic,event)
	{
		if(this.hashMap[topic] != undefined) 
			this.hashMap[topic].push(event)
		else
			this.hashMap[topic] = [event]
	}

	remove(topic,subscriber)
	{
		event = this.hashMap[topic]
		// remove subscriber
		subscriber_list.splice(subscriber_list.indexOf(subscriber),1)
		this.hashMap[topic]  = subscriber_list 
	}

	get_events(topic)
	{
		return this.hashMap[topic]
	}
}



subscriptions =  new Subscription()
eventQueues   =  new EventQueues()


clientWebSockets = {}  // id : websocket
UI_client = null
UI_socket.on('connection', function (UI_clientwebsocket,req) {
	UI_client = UI_clientwebsocket
console.log("UI connected")
serverSocket.on('connection', function (websocket,req) {

	//store sockets 
	

	websocket.on('message', function (message) {

			data = JSON.parse(message)

		    console.log('received from client %s : %s ', data.user_id, data.msgText)
		    var user_id = data.user_id 
			console.log(user_id + " connected")
			clientWebSockets[user_id] = websocket

			clientWebSockets[user_id].send("You are connected to server") 
		    msg_type = data.type  // PUBLISH or SUBCRIBE
		    if(msg_type == "publish")
		    {
				console.log("Publish received")

				UI_clientwebsocket.send( JSON.stringify({ "type" : "PUB" , "user_id" : data.user_id, "topic" : data.topic, "message" : data.msgText}))
		    	onPublish( { "topic" : data.topic, "message" : data.msgText} )
		    	

		    }
		    else if(msg_type == "subscribe")
		    {
		    	UI_clientwebsocket.send( JSON.stringify({ "type" : "SUB" , "user_id" : data.user_id, "topic" : data.topic}))
		    	onSubscribe( { id : data.user_id , "topic" : data.topic})	
		    }
		    else if(msg_type == "unsubscribe")
		    {
		    	onUnsubscribe( { id : user_id ,"topic" : msg_parts[1]})	
		    }

  	})

setInterval(dispatch_events,5000)


// This function will be called with different topic 
function dispatch_events()
{
	UI_clientwebsocket.send(JSON.stringify(subscriptions.hashMap))
	console.log("\n******* Dispatching Events *******")
	topics = Object.keys(eventQueues.hashMap)
	console.log(topics)
	if(topics.length == 0)
	{
		console.log("No topics registered\n")
		return
	}

	for(var topic of topics)
	{ 
		console.log(eventQueues.hashMap)
		console.log(topic)
		events = eventQueues.hashMap[topic]
		subscribers = subscriptions.hashMap[topic]
		
		if(events == undefined || events.length == 0) 
		{
			console.log("No events witnessed yet ")
			continue
		}

		if(subscribers == undefined || subscribers.length == 0)
		{
			console.log("No subscriber witnessed yet , events dropped")
			while(events.length != 0 )	
				{
					event =  events.shift()
				}
			continue
		}

		while(events.length != 0)	
		{
			event = events.shift()
			for(var subscriber_id of subscribers)
			{
					subscriber_socket = clientWebSockets[subscriber_id]
					UI_clientwebsocket.send( JSON.stringify({ "type" : "DIS" , "user_id" : subscriber_id, "topic" : topic, "message" : event}))
					subscriber_socket.send(event)
					console.log("Sent to : " + subscriber_id)
			}
		}
	}
}



})

})



function onPublish(data) {
	//publisher_id= data.publisher_id

	console.log("Publishing...")
   	topic_name 	= data.topic
   	message    	= data.message

   	eventQueues.add(topic_name,message)
   	console.log("Event successfully logged  : %s - %s ",topic_name,eventQueues.hashMap[topic_name])

   	// you can sending immediately
}

function onSubscribe(data) {	
	console.log("Subscribing...")
	subscriber_id	= data.id
   	topic_name 		= data.topic
   	subscriptions.add(topic_name,subscriber_id)
   	console.log("Subscription successfully added for %s", topic_name)
}

function onUnsubscribe(data) {	
	//subscriber_id	= data.subscriber_id
   subscriber_id	= req.body.subscriber_id
   topic_name 		= req.body.topic

   subscriptions.remove(topic_name,subscriber_id)
   console.log("Subscription successfully remove")
   
}







app.get('/', function (req, res) {
   	res.sendFile('index.html',{ root : __dirname});
})



var server 	= app.listen(8080, 'localhost', function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("app listening at " + host + ":" + port)
})
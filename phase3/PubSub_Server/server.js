var express = require('express');
var bodyParser = require('body-parser')

const WebSocket = require('ws')
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}));

function sleep( time ){
	console.log("Sleeping for " + time + " ms")
    var current = new Date().getTime();
    while(new Date().getTime() < current + time){  } 
}
server_ports = 	{ 	"server_0" : "3000",
					"server_1" : "3001"
} 
server_names = 	{  	3000 : "server_0",
				 	3001 : "server_1" 
				}


myPort =  parseInt(process.env.MY_PORT)
UI_port = myPort+1000
otherPort = null
for(var port in server_names)
{
	if(port != myPort)
		otherPort = port
}

topics = ["Sports", "Science", "Politics", "Fashion"]


my_name 	= 	server_names[myPort]
myTopics = null


myTopics = topics.filter((element, index) => {
				return index%2 === myPort%2;
			})

const UI_socket 		= new WebSocket.Server({host: "0.0.0.0", port:UI_port });

const myserverSocket 	= new WebSocket.Server({host: "0.0.0.0", port:myPort });
sleep(2000)

console.log("Myport:" + myPort + " myUIport :" + UI_port)
console.log("WebSocket server listening at " + "localhost" + ":" + myPort)

console.log("UI WebSocket server listening at " + "localhost" + ":" +UI_port)
class Subscription
{

	constructor()
	{
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

var otherSocket
function connectToOther() {

	sleep(500)
	otherSocket = new WebSocket("ws://192.168.99.100:" + otherPort);
	otherSocket.onopen = function(e){
		console.log("Other Port Open")
		console.log("Sent handshake")
		otherSocket.send(JSON.stringify({"readyState" : otherSocket.readyState}),function(error){console.log("Sendng error: " +  error)})
	}
	otherSocket.onclose = function(e){
				console.log("--Socket Closed--")
				setTimeout(connectToOther,1000)
			}
	otherSocket.onerror = function(e){
				console.log("--Error occured--")
				otherSocket.close()
			}
	otherSocket.onmessage = function (e) {
		data = e.data
		console.log("received reply to my forwarded message ")
		user_id = data.split(":")[0]
		event = data.split(":")[1]
		console.log("client sockets : " + Object.keys(clientWebSockets))
		console.log("client user id : " + user_id)
		clientWebSockets[user_id].send(event)
	}

}
			

UI_socket.on('connection', function (UI_clientwebsocket,req) 
{		
		UI_clientwebsocket.send(JSON.stringify({" readyState" :UI_clientwebsocket.readyState}))
		console.log("UI connected")
		connectToOther()
		myserverSocket.on('connection', function (websocket,req) 
		{
			websocket.on('message', function (message) {	
					console.log(message)
					data = JSON.parse(message)
				    console.log('received from client %s : %s ', data.user_id, data.msgText)

				    var user_id = data.user_id 
					console.log(user_id + " connected")
					clientWebSockets[user_id] = websocket
				    msg_type 	= data.type  
				    msg_topic 	= data.topic
				    if(myTopics.includes(msg_topic))
				    {
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
					}
					else
					{
						console.log("Forwaring to " + otherPort)
						forward(message,otherSocket)
					}
	  		})



setInterval(dispatch_events,10000)

function forward(message,otherserverSocket){

		otherserverSocket.send(message)
}
function dispatch_events()
{
	UI_clientwebsocket.send(JSON.stringify(subscriptions.hashMap))
	topics = Object.keys(eventQueues.hashMap)

	if(topics.length == 0)
	{
		return
	}

	for(var topic of topics)
	{ 
		//console.log(eventQueues.hashMap)
		//console.log(topic)
		events = eventQueues.hashMap[topic]
		subscribers = subscriptions.hashMap[topic]
		
		if(events == undefined || events.length == 0) 
		{
			//console.log("No events witnessed yet ")
			continue
		}

		if(subscribers == undefined || subscribers.length == 0)
		{
			//console.log("No subscriber witnessed yet , events dropped")
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
					subscriber_socket.send(subscriber_id+":"+event)
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
   	res.sendFile('server_UI'+ UI_port +'.html',{ root : __dirname});
})


http_port = 8080 + myPort%2
console.log(http_port)
var server 	= app.listen(http_port, '0.0.0.0', function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("app listening at " + host + ":" + port)
})
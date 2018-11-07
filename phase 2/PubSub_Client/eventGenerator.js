

topics = ["Sports", "Science", "Politics", "Entertainment"]

function randInt(a,b) {

	return Math.floor(Math.random() * b) + a
}

function generateRandomString(n) {
  var s = "";
  var alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < n; i++)
    s += alphanumeric.charAt(randInt(0,alphanumeric.length));

  return s;
}


function sleep( time ){
	console.log("Sleeping for " + time + " ms")
    var current = new Date().getTime();
    while(new Date().getTime() < current + time){  } 
}


function events_generate(num_clients)
{
    console.log("Entered function")

    var publisherClient = new Array(4)
	for(i=0; i<num_clients; i++){
		publisherClient[i]  = new pubsubClient()
	}
	publisherClient[num_clients-1].ClientWebSocket.onopen = function() 
	{
		for(i=0;i < 20;i++)
		{	
				sleep(randInt(10,40)*1000)
			    publisherIndex =randInt(0,4)
			    topicIndex 	= 	randInt(0,4)
			    message 	=   generateRandomString(randInt(4,8))
			    interval 	=	randInt(1,10)
				publisherClient[publisherIndex].publish(topics[topicIndex],message)
			    //setTimeout(publisherClient[publisherIndex].publish(topics[topicIndex],message),interval*1000)

		}
	}/*
	for(i=0;i < 10;i++)
		{
			
				console.log("In")
			    publisherIndex =randInt(0,4)
			    topicIndex 	= 	randInt(0,4)
			    message 	=   generateRandomString(randInt(4,8))
			    interval 	=	randInt(1,10)
				publisherClient[publisherIndex].publish(topics[topicIndex],message)
			    //setTimeout(publisherClient[publisherIndex].publish(topics[topicIndex],message),interval*1000)

		}*/
}

eventTest()
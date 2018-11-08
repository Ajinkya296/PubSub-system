
topics = ["Sports", "Science", "Politics", "Fashion"]

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


function subscription_generate(num_clients)
{
    var subscriberClients = new Array(4)
	for(i=0; i<num_clients; i++)
	{
		subscriberClients[i]  = new pubsubClient()
	}

	subscriberClients[num_clients-1].ClientWebSocket.onopen = function() 
	{
		for(i = 0 ; i < 7; i++)
		{	
				sleep(randInt(10,40)*100)
			    subscriberIndex =	randInt(0,4)
			    topicIndex 		= 	randInt(0,4)
			    message 		=   generateRandomString(randInt(4,8))
			    console.log("subscribing")
				subscriberClients[subscriberIndex].subscribe(topics[topicIndex])
			    //setTimeout(publisherClient[publisherIndex].publish(topics[topicIndex],message),interval*1000)

		}
	}
}

subscription_generate(10)
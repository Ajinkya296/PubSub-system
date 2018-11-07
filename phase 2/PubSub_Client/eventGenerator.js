

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
    var current = new Date().getTime();
    while(new Date().getTime() < current + time){  } 
}
function eventTest()
{
    console.log("Entered function")
    var publisherClient = new Array(4)
	for(i=0; i<4; i++){
    	publisherClient[i] = new pubsubClient()
	}
	i = 0
	while(i < 2){
		{
			console.log("In")
		    publisherIndex =randInt(0,4)
		    console.log("pub_idx "+publisherIndex +  publisherClient)
		    topicIndex 	= 	randInt(0,4)
		    message 	=   generateRandomString(randInt(4,8))
		    interval 	=	randInt(1,10) 
			sleep(5000)
			publisherClient[publisherIndex].publish(topics[topicIndex],message)
			
		    
		    //setTimeout(publisherClient[publisherIndex].publish(topics[topicIndex],message),interval*1000)
		    i++
		
		}
    }
}

eventTest()
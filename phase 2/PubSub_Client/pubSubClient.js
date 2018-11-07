function generateRandomID(n) {
  var id = "";
  var alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < n; i++)
    id += alphanumeric.charAt(Math.floor(Math.random() * alphanumeric.length));

  return id;
}

function waitForSocket(websocket)
{
  setTimeout(
    () => {
      if(websocket.readyState === 1)
      {
        console.log("Connected")
        return
      }
      else
      {
        console.log("Connecting ...")
        waitForSocket(websocket)
      }
    }
  ,10)
}
class pubsubClient{

  constructor(){
    this.ClientWebSocket = new WebSocket("ws://localhost:4000");//server uRL here
    this.id = generateRandomID(4)
    this.isconnected = false 
    //waitForSocket(this.ClientWebSocket)
  }
    connect(){
      this.ClientWebSocket.onopen = () => { 
                                              this.isconnected = true ; 
                                              console.log("Open")
                                          }
    }
    publish(topicID, message){
          
          var publishMSG = {
            user_id  : this.id,
            type:"publish",
            topic : topicID,
            msgText: message
          };
          console.log(publishMSG)
        
          this.ClientWebSocket.send(JSON.stringify(publishMSG));
          console.log("Msg sent")

    }
    subscribe(topicID){
        var subscribeMSG = {
          user_id  : this.id,
          type:"subscribe",
          topic: topicID
        };
        this.ClientWebSocket.onopen = function(event){
          that.ClientWebSocket.send(JSON.stringify(subscribeMSG));
        };
    }
    advertise(topicID){
      var advertiseMSG = {
        user_id  : this.id,
        type:"advertise",
        topic:topicID
      };
      this.ClientWebSocket.onopen = function(event){
        that.ClientWebSocket.send(JSON.stringify(advertiseMSG));
      };
    }
    unsubscribe(topicID){
        var unsubscribeMSG = {
          user_id  : this.id,
          type:"unsubscribe",
          topic: topicID
        };
        this.ClientWebSocket.onopen = function(event){
          that.ClientWebSocket.send(JSON.stringify(unsubscribeMSG));
        };
    }
}

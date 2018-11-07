class pubsubClient{
  constructor(){
    var ClientWebSocket = new WebSocket("");//server uRL here
  }
    publish(topicID, message){
          var publishMSG = {
            type:"publish",
            topic : topicID,
            msgText: message
          };
          ClientWebSocket.onopen = function(event){
            ClientWebSocket.send(JSON.stringify(publishMSG));
          };

    }
    subscribe(topicID){
        var subscribeMSG = {
          type:"subscribe",
          topic: topicID
        };
        ClientWebSocket.onopen = function(event){
          ClientWebSocket.send(JSON.stringify(subscribeMSG));
        };
    }
    advertise(topicID){
      var advertiseMSG = {
        type:"advertise",
        topic:topicID
      };
      ClientWebSocket.onopen = function(event){
        ClientWebSocket.send(JSON.stringify(advertiseMSG));
      };
    }
    unsubscribe(topicID){
        var unsubscribeMSG = {
          type:"unsubscribe",
          topic: topicID
        };
        ClientWebSocket.onopen = function(event){
          ClientWebSocket.send(JSON.stringify(unsubscribeMSG));
        };
    }
}

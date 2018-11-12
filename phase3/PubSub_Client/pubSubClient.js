function generateRandomID() {
  var id = "";
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numeric = "0123456789"
  for (var i = 0; i < 2; i++)
    id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  for (var i = 0; i < 2; i++)
    id += numeric.charAt(Math.floor(Math.random() * numeric.length));

  return id;
}
function addNotif(notif) {
  var ul = document.getElementById("notif");
  var li = document.createElement("li");

  var div_elem = document.createElement("div");

  div_elem.appendChild(document.createTextNode("["+new Date().toLocaleString().split(" ")[1] + "] " + notif));
  li.appendChild(div_elem);
  li.setAttribute("class", "list-group-item"); 
  li.setAttribute("style", "background-color:#f1f2f6; color: #495057;font-size: 1.25em ;  padding: 0.5rem 0.5rem;");
  ul.appendChild(li);
};
class pubsubClient{

  constructor(){
    this.port = 3001
    //if(Math.random() > 0.5)
    //  this.port = 3001
    this.ClientWebSocket = new WebSocket("ws://192.168.99.100:"+this.port);
    //this.ClientWebSocket = new WebSocket("ws://localhost:4000");
    this.id = generateRandomID()
  }

    connect()
    {
      this.ClientWebSocket.send("handshake")
    }
    publish(topicID, message){
          
          var publishMSG = {
            user_id  : this.id,
            type:"publish",
            topic : topicID,
            msgText: message
          };
          console.log(publishMSG)
          addNotif("Publisher " + this.id + " sent msg \"" + message +"\" on " + topicID)
          this.ClientWebSocket.send(JSON.stringify(publishMSG));
          console.log("Msg sent")

    }
    subscribe(topicID){
        var subscribeMSG = {
          user_id  : this.id,
          type:"subscribe",
          topic: topicID
        };
        console.log("Subscriber "+ this.id +" subscribed to " + topicID + " on port " + this.port)
        addNotif( "Subscriber "+ this.id +" subscribed to " + topicID)
        this.ClientWebSocket.send(JSON.stringify(subscribeMSG));
        
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

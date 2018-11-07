publisherClient = new Array(4)
for(i=0; i<4; i++){
    publisherClient[i] = new pubsubClient()
}
topics = ["sports", "Science", "Politics", "Entertainment"]
function eventTest(){
    console.log("Entered function")
    publisherIndex = Math.round(Math.rand()*4)
    topicIndex = Math.round(Math.rand()*4)
    message="Test"
    publisherClient[publisherIndex].publish(topics[topicIndex],message)
    i++
}

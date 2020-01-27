import Vue from 'vue'

new Vue({
  el: '#app',
  data:{
    title:'MQTT 2',
    client:null,
    messages:[],
    isConnected:false,
    hostname:null,
    port:null,
    subs_topic:'',
    pub_topic:'',
    pub_message:'',
    topic_subcriptions:['test','test2','test3/hola']
  },
  methods:{
    disconnect:function(){
      console.log("client is disconnecting..");
      this.client.disconnect();
      this.isConnected = false;
    },
    connect:function(){
      // var location = {
      //   hostname:'64.227.50.39',
      //   port:8083
      // };
      
      this.client = new Paho.Client(this.hostname, Number(this.port),"clientId");

      // set callback handlers
      this.client.onConnectionLost = this.onConnectionLost;
      this.client.onMessageArrived = this.onMessageArrived;

      // connect the client
      this.client.connect({
        onSuccess:this.onConnect, 
        onFailure:this.onFailure,
        cleanSession:true,
        keepAliveInterval:1000,
        timeout:10,
        reconnect:true,
      });
      
    },
    publish:function(){
      console.log('publishing')
      var message = new Paho.Message(this.pub_message);
      message.destinationName = this.pub_topic;
      this.client.send(message);
      this.pub_topic = '';
      this.pub_message = '';
    },
    subscribe:function(){
      console.log('subscribing')
      this.client.subscribe(this.subs_topic);
      this.topic_subcriptions.push(this.subs_topic);
      this.subs_topic = '';
    },
    ubsubscribe:function(){
      console.log('unsubscribing')
    },
    onConnect:function(response){
      console.log("onConnect");
      this.isConnected = true;
    },
    onFailure:function(message){
      console.log('Connection attemp');
    },
    onConnectionLost:function(responseObject){
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
      this.isConnected = false;
    },
    onMessageArrived:function(message){
      console.log(message);
      console.log("onMessageArrived:"+message.payloadString);
      this.messages.push({message:message.payloadString,topic:message.destinationName});
    }
  }
})

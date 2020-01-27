import Vue from 'vue'

new Vue({
  el: '#app',
  data:{
    title:'MQTT 2',
    client:null,
    messages:[],
    isConnected:false
  },
  methods:{
    disconnect:function(){
      console.log("client is disconnecting..");
      this.client.disconnect();
      this.isConnected = false;
    },
    connect:function(){
      var location = {
        hostname:'64.227.50.39',
        port:8083
      };
      
      this.client = new Paho.Client(location.hostname, Number(location.port),"clientId");

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
      var topic = 'test';
      var message = new Paho.Message("Hello");
      message.destinationName = topic;
      this.client.send(message);
    },
    subscribe:function(){
      console.log('subscribing')
      var topic = 'test';
      this.client.subscribe(topic);
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
    }
  }
})
